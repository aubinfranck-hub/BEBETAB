package com.bebetab.update

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ApkUrlTest {
    @Test fun `les telechargements GitHub en https sont acceptes`() {
        assertTrue(isTrustedApkUrl("https://github.com/aubinfranck-hub/BEBETAB/releases/download/v1.2.0/bebetab-release.apk"))
        assertTrue(isTrustedApkUrl("https://objects.githubusercontent.com/github-production-release-asset/abc"))
    }

    @Test fun `les autres hotes ou protocoles sont refuses`() {
        assertFalse(isTrustedApkUrl("http://github.com/x/y/releases/download/v1/a.apk"))
        assertFalse(isTrustedApkUrl("https://evil.example.com/a.apk"))
        assertFalse(isTrustedApkUrl("https://github.com.evil.net/a.apk"))
        assertFalse(isTrustedApkUrl("https://evilgithub.com/a.apk"))
        assertFalse(isTrustedApkUrl("https://user:pw@github.com/a.apk"))
        assertFalse(isTrustedApkUrl("file:///sdcard/a.apk"))
        assertFalse(isTrustedApkUrl(""))
        assertFalse(isTrustedApkUrl("pas une url"))
    }
}
