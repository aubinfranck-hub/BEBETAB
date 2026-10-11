package com.bebetab.update

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

data class UpdateInfo(
    val versionCode: Int,
    val versionName: String,
    val apkUrl: String,
    val sha256: String,
    val mandatory: Boolean = false,
    val notesFr: String = "",
    val notesEn: String = ""
)

/**
 * L'APK ne peut être téléchargé que depuis GitHub (https). Le manifeste vient du même dépôt que l'APK :
 * sans cette vérification, un manifeste modifié pourrait pointer vers n'importe quel serveur.
 */
internal fun isTrustedApkUrl(url: String): Boolean {
    val uri = try { java.net.URI(url) } catch (e: Exception) { return false }
    if (uri.scheme != "https" || uri.userInfo != null) return false
    val host = uri.host?.lowercase() ?: return false
    return host == "github.com" || host.endsWith(".github.com") ||
        host == "githubusercontent.com" || host.endsWith(".githubusercontent.com")
}

sealed interface UpdateResult {
    data class Available(val info: UpdateInfo) : UpdateResult
    data object UpToDate : UpdateResult
    data class Error(val message: String) : UpdateResult
}

object UpdateManager {
    private const val MANIFEST_URL =
        "https://raw.githubusercontent.com/aubinfranck-hub/BEBETAB/main/update.json"
    private const val APK_NAME = "bebetab-update.apk"

    suspend fun check(context: Context): UpdateResult = withContext(Dispatchers.IO) {
        try {
            val manifest = readText(MANIFEST_URL)
            val json = JSONObject(manifest)
            val info = UpdateInfo(
                versionCode = json.getInt("versionCode"),
                versionName = json.getString("versionName"),
                apkUrl = json.getString("apkUrl"),
                sha256 = json.getString("sha256").lowercase(),
                mandatory = json.optBoolean("mandatory", false),
                notesFr = json.optString("notesFr"),
                notesEn = json.optString("notesEn")
            )
            val current = context.packageManager.getPackageInfo(context.packageName, 0).longVersionCode
            if (info.versionCode <= current) UpdateResult.UpToDate
            else if (!isTrustedApkUrl(info.apkUrl)) UpdateResult.Error("Untrusted APK URL")
            else UpdateResult.Available(info)
        } catch (e: Exception) {
            UpdateResult.Error(e.message ?: "Update check failed")
        }
    }

    suspend fun download(context: Context, info: UpdateInfo): File = withContext(Dispatchers.IO) {
        val dir = File(context.cacheDir, "updates").apply { mkdirs() }
        val target = File(dir, APK_NAME)
        if (target.exists()) target.delete()

        val connection = (URL(info.apkUrl).openConnection() as HttpURLConnection).apply {
            connectTimeout = 15_000
            readTimeout = 60_000
            instanceFollowRedirects = true
            requestMethod = "GET"
        }
        connection.connect()
        if (connection.responseCode !in 200..299) {
            throw IllegalStateException("Download HTTP " + connection.responseCode)
        }

        connection.inputStream.use { input ->
            FileOutputStream(target).use { output ->
                val buffer = ByteArray(64 * 1024)
                while (true) {
                    val read = input.read(buffer)
                    if (read <= 0) break
                    output.write(buffer, 0, read)
                }
                output.flush()
            }
        }
        connection.disconnect()

        val digest = sha256(target)
        if (!digest.equals(info.sha256, ignoreCase = true)) {
            target.delete()
            throw SecurityException("APK checksum mismatch")
        }
        target
    }

    fun install(context: Context, apk: File) {
        val uri = FileProvider.getUriForFile(
            context,
            context.packageName + ".fileprovider",
            apk
        )
        val intent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, "application/vnd.android.package-archive")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(intent)
    }

    fun canInstallUnknownSources(context: Context): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.packageManager.canRequestPackageInstalls()
        } else true
    }

    fun openUnknownSourcesSettings(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val uri = Uri.parse("package:" + context.packageName)
            context.startActivity(
                Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, uri)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        }
    }

    private fun readText(url: String): String {
        val connection = (URL(url).openConnection() as HttpURLConnection).apply {
            connectTimeout = 10_000
            readTimeout = 15_000
            instanceFollowRedirects = true
        }
        return try {
            if (connection.responseCode !in 200..299) {
                throw IllegalStateException("Manifest HTTP " + connection.responseCode)
            }
            connection.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
        } finally {
            connection.disconnect()
        }
    }

    private fun sha256(file: File): String {
        val digest = MessageDigest.getInstance("SHA-256")
        file.inputStream().use { input ->
            val buffer = ByteArray(64 * 1024)
            while (true) {
                val read = input.read(buffer)
                if (read <= 0) break
                digest.update(buffer, 0, read)
            }
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }
}
