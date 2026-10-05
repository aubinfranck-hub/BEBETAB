package com.bebetab.data

data class Bilingual(val fr:String,val en:String){ fun text(lang:String)=if(lang=="en") en else fr }
data class CountryContent(val id:String,val name:Bilingual,val flag:String,val continent:Bilingual,val fact:Bilingual,val cards:List<Bilingual>)
data class ActivityContent(val id:String,val title:Bilingual,val emoji:String,val description:Bilingual)

object ContentData {
 val countries=listOf(
  CountryContent("france",Bilingual("France","France"),"🇫🇷",Bilingual("Europe","Europe"),Bilingual("La capitale de la France est Paris.","The capital of France is Paris."),listOf(Bilingual("Tour Eiffel","Eiffel Tower"),Bilingual("Gastronomie","Food"),Bilingual("Art","Art"),Bilingual("Sports","Sports"),Bilingual("Monuments","Monuments"),Bilingual("Régions","Regions"))),
  CountryContent("ivory-coast",Bilingual("Côte d’Ivoire","Côte d’Ivoire"),"🇨🇮",Bilingual("Afrique","Africa"),Bilingual("La capitale politique est Yamoussoukro et Abidjan est la capitale économique.","The political capital is Yamoussoukro and Abidjan is the economic capital."),listOf(Bilingual("Abidjan","Abidjan"),Bilingual("Yamoussoukro","Yamoussoukro"),Bilingual("Cacao","Cocoa"),Bilingual("Danse","Dance"),Bilingual("Océan","Ocean"),Bilingual("Savane","Savanna"))),
  CountryContent("kenya",Bilingual("Kenya","Kenya"),"🇰🇪",Bilingual("Afrique","Africa"),Bilingual("Le Kenya est connu pour ses grandes savanes et sa faune.","Kenya is known for its great savannas and wildlife."),listOf(Bilingual("Nairobi","Nairobi"),Bilingual("Safari","Safari"),Bilingual("Lions","Lions"),Bilingual("Mont Kenya","Mount Kenya"),Bilingual("Masaï","Maasai"),Bilingual("Océan Indien","Indian Ocean"))),
  CountryContent("japan",Bilingual("Japon","Japan"),"🇯🇵",Bilingual("Asie","Asia"),Bilingual("Tokyo est la capitale du Japon.","Tokyo is the capital of Japan."),listOf(Bilingual("Tokyo","Tokyo"),Bilingual("Sakura","Cherry blossom"),Bilingual("Robotique","Robotics"),Bilingual("Manga","Manga"),Bilingual("Mont Fuji","Mount Fuji"),Bilingual("Océan","Ocean"))),
  CountryContent("egypt",Bilingual("Égypte","Egypt"),"🇪🇬",Bilingual("Afrique","Africa"),Bilingual("Les pyramides de Gizeh sont parmi les monuments les plus célèbres du monde.","The pyramids of Giza are among the world's most famous monuments."),listOf(Bilingual("Le Caire","Cairo"),Bilingual("Pyramides","Pyramids"),Bilingual("Nil","Nile"),Bilingual("Pharaons","Pharaohs"),Bilingual("Désert","Desert"),Bilingual("Sphinx","Sphinx")))
 )
 val subjects=listOf(
  ActivityContent("letters",Bilingual("Lettres","Letters"),"🔤",Bilingual("Reconnaître les lettres et leurs sons.","Recognize letters and their sounds.")),
  ActivityContent("numbers",Bilingual("Nombres","Numbers"),"🔢",Bilingual("Compter de 1 à 9.","Count from 1 to 9.")),
  ActivityContent("science",Bilingual("Sciences","Science"),"🔬",Bilingual("Découvrir comment fonctionne le monde.","Discover how the world works.")),
  ActivityContent("world",Bilingual("Monde","World"),"🌍",Bilingual("Découvrir pays et continents.","Discover countries and continents.")),
  ActivityContent("animals",Bilingual("Animaux","Animals"),"🦁",Bilingual("Reconnaître les animaux.","Recognize animals.")),
  ActivityContent("space",Bilingual("Espace","Space"),"🚀",Bilingual("Explorer les planètes et les étoiles.","Explore planets and stars.")),
  ActivityContent("art",Bilingual("Art","Art"),"🎨",Bilingual("Créer et observer.","Create and observe.")),
  ActivityContent("languages",Bilingual("Langues","Languages"),"🗣️",Bilingual("Découvrir des mots en français et anglais.","Discover French and English words."))
 )
 val games=listOf(
  ActivityContent("puzzle",Bilingual("Puzzles","Puzzles"),"🧩",Bilingual("Assemble les bonnes pièces.","Put the right pieces together.")),
  ActivityContent("math",Bilingual("Maths","Math"),"➕",Bilingual("Résous de petits calculs.","Solve simple calculations.")),
  ActivityContent("geography",Bilingual("Géographie","Geography"),"🗺️",Bilingual("Place les pays sur la carte.","Place countries on the map.")),
  ActivityContent("animals",Bilingual("Animaux","Animals"),"🐾",Bilingual("Trouve le bon animal.","Find the right animal.")),
  ActivityContent("memory",Bilingual("Mémoire","Memory"),"🧠",Bilingual("Retrouve les paires.","Find the pairs.")),
  ActivityContent("logic",Bilingual("Logique","Logic"),"💡",Bilingual("Trouve la suite logique.","Find the logical sequence.")),
  ActivityContent("french",Bilingual("Français","French"),"🇫🇷",Bilingual("Joue avec les mots français.","Play with French words.")),
  ActivityContent("english",Bilingual("Anglais","English"),"🇬🇧",Bilingual("Joue avec les mots anglais.","Play with English words."))
 )
 val stories=listOf(Bilingual("Fanti dans la forêt","Fanti in the Forest"),Bilingual("Le trésor du désert","The Desert Treasure"),Bilingual("Voyage dans l’espace","Space Voyage"))
}