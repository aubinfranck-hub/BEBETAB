package com.bebetab.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private data class IvorianLesson(
    val title:String,
    val explanation:String,
    val example:String,
    val question:String,
    val answers:List<String>,
    val correct:Int,
    val hint:String
)
private data class IvorianSubject(val title:String,val lessons:List<IvorianLesson>)
private data class IvorianGrade(val label:String,val age:String,val subjects:List<IvorianSubject>)

private fun lesson(title:String,explanation:String,example:String,question:String,answers:List<String>,correct:Int,hint:String)=
    IvorianLesson(title,explanation,example,question,answers,correct,hint)
private fun subject(title:String,vararg lessons:IvorianLesson)=IvorianSubject(title,lessons.toList())
private fun grade(label:String,age:String,vararg subjects:IvorianSubject)=IvorianGrade(label,age,subjects.toList())

private val ciPrimaryGrades=listOf(
    grade("CP1","6–7 ans",
        subject("Français",lesson("Reconnaître les voyelles","Une voyelle est un son que l’on peut prononcer sans bloquer l’air. On apprend à la reconnaître à l’oral et à l’écrit.","a · e · i · o · u · y","Quelle lettre est une voyelle ?",listOf("b","a","t"),1,"La lettre a est une voyelle.")),
        subject("Mathématiques",lesson("Compter et comparer","Compte chaque objet une seule fois, puis compare les quantités.","4 mangues sont plus nombreuses que 3 mangues.","Quel nombre vient après 8 ?",listOf("7","9","10"),1,"Après 8 vient 9.")),
        subject("EDHC",lesson("Vivre ensemble en classe","Une règle protège les élèves et aide chacun à apprendre dans le calme.","J’écoute mon camarade et je respecte le matériel commun.","Que faire quand un camarade parle ?",listOf("L’écouter","Le pousser","Crier plus fort"),0,"On écoute chacun son tour.")),
        subject("EPS",lesson("Courir et s’arrêter au signal","En EPS, on apprend à bouger en sécurité et à respecter les consignes.","Au signal convenu, je ralentis puis je m’arrête.","Que fais-tu au signal d’arrêt ?",listOf("Je m’arrête","Je pousse","Je continue sans regarder"),0,"Le signal demande de s’arrêter.")),
        subject("AEC",lesson("Tracer des formes et des lignes","Les arts permettent de s’exprimer avec des lignes, des couleurs, des sons et des gestes.","Un cercle, une ligne droite et une ligne ondulée sont des tracés différents.","Quelle forme n’a pas de côté droit ?",listOf("Le cercle","Le carré","Le triangle"),0,"Le cercle est arrondi."))),
    grade("CP2","7–8 ans",
        subject("Français",lesson("Former et lire des syllabes","Une syllabe associe souvent une consonne et une voyelle. On les assemble pour lire un mot.","m + a = ma ; ma + mi = mamie","Quelle syllabe donne m avec i ?",listOf("mi","mo","la"),0,"La consonne m avec la voyelle i donne mi.")),
        subject("Mathématiques",lesson("Additionner de petites quantités","L’addition réunit des quantités. On peut compter en avançant.","7 + 5 = 12","Combien font 6 + 3 ?",listOf("8","9","10"),1,"Pars de 6 et avance de 3.")),
        subject("EDHC",lesson("Prendre soin de sa santé","L’hygiène protège le corps et aide à éviter certaines maladies.","Je me lave les mains avec de l’eau propre et du savon.","Quand faut-il se laver les mains ?",listOf("Avant de manger","Jamais","Seulement le soir"),0,"Lave-les avant de manger et après être allé aux toilettes.")),
        subject("EPS",lesson("Sauter et garder l’équilibre","Un saut se prépare, se réalise dans une zone dégagée et se termine par une réception stable.","Je plie les genoux et je regarde devant moi.","Comment préparer un saut ?",listOf("Plier les genoux","Fermer les yeux","Pousser un camarade"),0,"Les jambes fléchies aident à sauter et à réceptionner.")),
        subject("AEC",lesson("Créer un rythme","Un rythme est une suite de sons ou de silences que l’on peut répéter.","Frappe deux fois dans les mains, puis marque une pause.","Après deux frappes, que peux-tu ajouter ?",listOf("Une pause","Un cri obligatoire","Rien ne peut changer"),0,"Une pause fait aussi partie du rythme."))),
    grade("CE1","8–9 ans",
        subject("Français",lesson("Lire une phrase et en comprendre le sens","Une phrase exprime une idée. Pour la comprendre, repère les mots importants et ce qui se passe.","Awa arrose le jeune plant.","Qui arrose le plant ?",listOf("Awa","Le plant","La classe"),0,"Le nom de la personne est au début de la phrase.")),
        subject("Mathématiques",lesson("Additionner des nombres à deux chiffres","Additionne d’abord les unités, puis les dizaines. Regroupe les unités quand elles font une dizaine.","36 + 27 = 63","Combien font 24 + 15 ?",listOf("39","38","49"),0,"20 + 10 = 30 et 4 + 5 = 9.")),
        subject("Sciences et technologie",lesson("Les besoins d’une plante","Une plante a besoin d’eau, de lumière et d’un milieu adapté pour grandir.","Un plant arrosé régulièrement pousse mieux qu’un plant laissé au sec.","De quoi une plante a-t-elle besoin ?",listOf("D’eau et de lumière","De plastique","De fumée"),0,"L’eau et la lumière participent à sa croissance.")),
        subject("Histoire-Géographie",lesson("Se repérer dans son milieu","Un plan et des repères permettent de décrire un trajet et de situer des lieux proches.","L’école peut se trouver près d’un marché ou d’une route.","Quel outil aide à représenter un quartier ?",listOf("Un plan","Une balance","Un thermomètre"),0,"Un plan représente des lieux vus du dessus.")),
        subject("EDHC",lesson("Respecter les autres","Le respect se manifeste par des paroles justes, l’écoute et le soin des biens communs.","Je demande la permission avant d’emprunter un objet.","Que faire avant d’emprunter ?",listOf("Demander la permission","Cacher l’objet","Le prendre sans prévenir"),0,"Demander protège la confiance.")),
        subject("EPS",lesson("Jouer en équipe","Une équipe s’organise, respecte les règles et encourage ses membres.","Je passe le ballon à un partenaire libre.","Comment aider son équipe ?",listOf("Jouer ensemble","Garder toujours le ballon","Tricher"),0,"Coopérer aide toute l’équipe.")),
        subject("AEC",lesson("Composer avec des formes","On peut organiser des formes et des couleurs pour représenter une idée.","Des triangles, des rectangles et des couleurs peuvent créer une maison.","Que faut-il pour composer une image ?",listOf("Des formes et des couleurs","Une seule lettre","Aucun élément"),0,"Une composition organise des éléments visuels."))),
    grade("CE2","9–10 ans",
        subject("Français",lesson("Ponctuer une phrase","La ponctuation aide le lecteur à comprendre une phrase et son intonation.","Une question se termine par un point d’interrogation.","Quel signe termine une question ?",listOf(".","?","!"),1,"Le point d’interrogation signale une question.")),
        subject("Mathématiques",lesson("Comprendre la multiplication","Multiplier, c’est additionner plusieurs fois la même quantité.","4 × 6 représente quatre groupes de six.","Combien font 3 × 5 ?",listOf("8","15","20"),1,"Additionne 5 + 5 + 5.")),
        subject("Sciences et technologie",lesson("Protéger l’environnement","Les sols, l’eau, les plantes et les animaux font partie d’un milieu à protéger.","Mettre les déchets dans une poubelle évite de salir la cour et les caniveaux.","Quel geste protège le milieu ?",listOf("Trier ou jeter les déchets au bon endroit","Brûler les plastiques près des maisons","Jeter dans le caniveau"),0,"Les déchets ne doivent pas finir dans la nature.")),
        subject("Histoire-Géographie",lesson("Lire une carte simple","Une carte représente un territoire. Le titre, la légende et les repères aident à la lire.","La légende explique les symboles utilisés sur la carte.","À quoi sert la légende ?",listOf("À expliquer les symboles","À mesurer le poids","À raconter une chanson"),0,"La légende donne le sens des signes de la carte.")),
        subject("EDHC",lesson("Droits et devoirs de l’enfant","Les droits protègent l’enfant. Les devoirs rappellent sa participation au respect des autres et des règles.","Le droit à l’éducation s’accompagne du respect du travail en classe.","Quel exemple est un droit de l’enfant ?",listOf("Recevoir une éducation","Abîmer les livres","Empêcher les autres d’apprendre"),0,"L’accès à l’éducation est un droit.")),
        subject("EPS",lesson("Lancer avec précision","Pour viser une cible, on ajuste sa posture, sa direction et la force du lancer.","Je regarde la cible avant de lancer un objet léger.","Que faut-il regarder avant de lancer ?",listOf("La cible","Le sol derrière soi","Le public seulement"),0,"Regarder la cible aide à viser.")),
        subject("AEC",lesson("Découvrir les sons et les instruments","Les sons peuvent être forts ou doux, longs ou courts. On peut les produire avec la voix ou un instrument.","Un tambour produit un son quand on le frappe.","Comment le tambour produit-il un son ?",listOf("En le frappant","En le dessinant","En le pliant"),0,"Le tambour est un instrument à percussion."))),
    grade("CM1","10–11 ans",
        subject("Français",lesson("Accorder le verbe avec le sujet","Le verbe change selon le sujet. Repère d’abord qui fait l’action.","Les élèves lisent ; l’élève lit.","Quel verbe complète : « Les filles ___ » ?",listOf("chante","chantent","chanter"),1,"Avec un sujet pluriel, le verbe s’accorde au pluriel.")),
        subject("Mathématiques",lesson("Partager une unité en fractions","Une fraction représente une ou plusieurs parts égales d’une unité.","1/2 signifie une part sur deux parts égales.","Quelle fraction représente une part sur quatre ?",listOf("1/2","1/3","1/4"),2,"Le dénominateur indique le nombre de parts égales.")),
        subject("Sciences et technologie",lesson("Observer le corps et la santé","L’alimentation variée, l’eau, le sommeil et l’hygiène soutiennent la santé.","Pour une observation, on décrit ce que l’on voit avant de tirer une conclusion.","Quelle étape vient avant la conclusion ?",listOf("L’observation","La devinette","La copie"),0,"On observe puis on explique.")),
        subject("Histoire-Géographie",lesson("Décrire les paysages de Côte d’Ivoire","Un paysage peut être décrit par le relief, l’eau, la végétation et les activités humaines.","La forêt, la savane et le littoral présentent des caractéristiques différentes.","Quel élément décrit un paysage ?",listOf("La végétation","La couleur d’un cahier","Le numéro d’une classe"),0,"La végétation fait partie du paysage.")),
        subject("EDHC",lesson("Agir comme citoyen responsable","La citoyenneté repose sur le respect des personnes, des biens communs et des règles collectives.","Protéger le matériel de l’école est un geste citoyen.","Quel geste respecte un bien commun ?",listOf("Prendre soin du matériel scolaire","Le casser exprès","L’emporter sans accord"),0,"Le matériel partagé doit être préservé.")),
        subject("EPS",lesson("Organiser une activité sportive","Un jeu sportif demande des rôles, des règles et un espace sûr.","Avant le jeu, les équipes déterminent les limites du terrain.","Pourquoi délimiter le terrain ?",listOf("Pour jouer en sécurité","Pour empêcher de jouer","Pour cacher le ballon"),0,"Les limites rendent le jeu plus sûr et compréhensible.")),
        subject("AEC",lesson("Préparer une production artistique","Une production artistique peut associer dessin, couleur, chant ou mouvement.","Choisir les couleurs avant de peindre aide à organiser son travail.","Que peut-on planifier avant de peindre ?",listOf("Les couleurs","La météo de demain","Le résultat d’un autre élève"),0,"Préparer ses choix aide à exprimer son idée."))),
    grade("CM2","11–12 ans",
        subject("Français",lesson("Organiser un texte","Un texte clair présente une idée, des phrases reliées et une ponctuation adaptée.","Un paragraphe regroupe des phrases qui parlent d’une même idée.","Que regroupe un paragraphe ?",listOf("Des phrases sur une même idée","Des nombres au hasard","Des lettres sans ordre"),0,"Le paragraphe développe une idée principale.")),
        subject("Mathématiques",lesson("Additionner des nombres décimaux","Aligne les virgules pour additionner les unités de même rang.","2,5 + 1,3 = 3,8","Combien font 4,2 + 1,5 ?",listOf("5,7","5,17","4,7"),0,"Additionne 4,2 et 1,5 en alignant les virgules.")),
        subject("Sciences et technologie",lesson("Économiser l’eau et l’énergie","Des gestes simples limitent le gaspillage et protègent les ressources.","Fermer un robinet après usage évite de gaspiller l’eau.","Quel geste économise l’eau ?",listOf("Fermer le robinet","Le laisser couler","Jeter de l’eau propre"),0,"Fermer le robinet conserve l’eau.")),
        subject("Histoire-Géographie",lesson("Lire et décrire un territoire ivoirien","Une description géographique situe un espace et présente ses éléments naturels et humains.","On peut citer une ville, une activité et un élément du milieu.","Que peut contenir une description de territoire ?",listOf("Des repères et des activités","Une liste de couleurs sans lieu","Un calcul seul"),0,"Repères, milieu et activités décrivent un territoire.")),
        subject("EDHC",lesson("Participer à la vie collective","Une communauté fonctionne mieux quand chacun respecte les droits et contribue aux responsabilités communes.","Écouter des avis différents aide à prendre une décision collective.","Quelle attitude favorise une décision collective ?",listOf("Écouter les avis","Imposer sans discussion","Se moquer des autres"),0,"L’écoute permet de considérer les points de vue.")),
        subject("EPS",lesson("Respecter l’équité dans le jeu","L’équité consiste à appliquer les règles de la même façon et à respecter les joueurs.","On accepte l’arbitrage et le résultat d’une rencontre.","Quel comportement est équitable ?",listOf("Respecter les règles communes","Changer les règles pour gagner","Écarter un joueur sans raison"),0,"Les règles communes s’appliquent à tous.")),
        subject("AEC",lesson("Présenter une œuvre","Décrire une œuvre, c’est nommer ses formes, ses couleurs, ses sons ou ses choix artistiques.","On explique ce que l’on a voulu montrer et les techniques utilisées.","Que peut-on décrire dans une œuvre ?",listOf("Ses formes et ses couleurs","La taille d’une salle voisine","Un résultat de calcul"),0,"Les formes et les couleurs sont des éléments de l’œuvre.")))
)

@Composable
fun IvorianCurriculumScreen(language:String,onStars:(Int)->Unit) {
    val english=language=="en"
    var selectedGrade by remember { mutableStateOf<IvorianGrade?>(null) }
    var selectedSubject by remember { mutableStateOf<IvorianSubject?>(null) }
    var answered by remember { mutableIntStateOf(-1) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(14.dp),verticalArrangement=Arrangement.spacedBy(10.dp)) {
        Text(if(english) "Côte d’Ivoire school programme" else "Programme scolaire ivoirien",fontSize=24.sp,fontWeight=FontWeight.Bold,color=Color(0xFF274060))
        Text(if(english) "Choose your class, then open a lesson." else "Choisis ta classe, puis ouvre une leçon.",color=Color(0xFF526477))
        if(selectedGrade==null) {
            ciPrimaryGrades.chunked(2).forEach { row ->
                Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(10.dp)) {
                    row.forEach { grade ->
                        Card(onClick={selectedGrade=grade;selectedSubject=null;answered=-1},modifier=Modifier.weight(1f),colors=CardDefaults.cardColors(containerColor=Color(0xFFEAF5FF))) {
                            Column(Modifier.fillMaxWidth().padding(14.dp),horizontalAlignment=Alignment.CenterHorizontally) {
                                Text(grade.label,fontSize=23.sp,fontWeight=FontWeight.Bold,color=Color(0xFF1E5793))
                                Text(grade.age,fontSize=13.sp,color=Color(0xFF526477))
                            }
                        }
                    }
                    if(row.size==1) Spacer(Modifier.weight(1f))
                }
            }
            Text(if(english) "Curriculum subjects follow the Ivorian primary programme." else "Les matières suivent le programme officiel du primaire ivoirien.",fontSize=12.sp,color=Color(0xFF667788))
        } else if(selectedSubject==null) {
            TextButton(onClick={selectedGrade=null}) { Text(if(english) "← Classes" else "← Classes") }
            Text(selectedGrade!!.label+" • "+selectedGrade!!.age,fontSize=20.sp,fontWeight=FontWeight.Bold)
            selectedGrade!!.subjects.chunked(2).forEach { row ->
                Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(10.dp)) {
                    row.forEach { subject ->
                        Card(onClick={selectedSubject=subject;answered=-1},modifier=Modifier.weight(1f),colors=CardDefaults.cardColors(containerColor=Color(0xFFF5F8FC))) {
                            Text(subject.title,Modifier.fillMaxWidth().padding(16.dp),fontSize=16.sp,fontWeight=FontWeight.SemiBold,textAlign=TextAlign.Center)
                        }
                    }
                    if(row.size==1) Spacer(Modifier.weight(1f))
                }
            }
        } else {
            TextButton(onClick={selectedSubject=null;answered=-1}) { Text(if(english) "← Subjects" else "← Matières") }
            val current=selectedSubject!!.lessons.first()
            Text(selectedGrade!!.label+" • "+selectedSubject!!.title,fontSize=20.sp,fontWeight=FontWeight.Bold,color=Color(0xFF274060))
            Card(colors=CardDefaults.cardColors(containerColor=Color(0xFFFFF7E6)),modifier=Modifier.fillMaxWidth()) {
                Column(Modifier.padding(18.dp),verticalArrangement=Arrangement.spacedBy(9.dp)) {
                    Text(current.title,fontSize=21.sp,fontWeight=FontWeight.Bold,color=Color(0xFF274060))
                    Text(current.explanation,fontSize=16.sp,lineHeight=23.sp)
                    Text("Exemple : "+current.example,fontWeight=FontWeight.SemiBold,color=Color(0xFF526477))
                }
            }
            Text(current.question,fontSize=18.sp,fontWeight=FontWeight.Bold)
            current.answers.forEachIndexed { index, answer ->
                Card(
                    onClick={if(answered<0){answered=index;if(index==current.correct)onStars(2)}},
                    modifier=Modifier.fillMaxWidth(),
                    colors=CardDefaults.cardColors(containerColor=when { answered<0->Color(0xFFEAF5FF);index==current.correct->Color(0xFFE3F5E8);index==answered->Color(0xFFFFE9E5);else->Color(0xFFF3F5F7) })
                ) { Text(answer,Modifier.fillMaxWidth().padding(14.dp),fontSize=17.sp,textAlign=TextAlign.Center) }
            }
            if(answered>=0) {
                Text(if(answered==current.correct) (if(english) "Correct! +2 stars ⭐" else "Bonne réponse ! +2 étoiles ⭐") else "Indice : "+current.hint,
                    color=if(answered==current.correct)Color(0xFF21864A) else Color(0xFF9B5A12),fontWeight=FontWeight.SemiBold)
                Button(onClick={answered=-1;selectedSubject=null},modifier=Modifier.fillMaxWidth()) { Text(if(english) "Back to subjects" else "Retour aux matières") }
            }
        }
    }
}
