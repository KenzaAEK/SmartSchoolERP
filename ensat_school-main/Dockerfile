# ===============================
# ÉTAPE 1 : Build (Construction)
# ===============================
# On utilise une image JDK complète pour compiler
FROM eclipse-temurin:17-jdk-jammy AS build

WORKDIR /app

# Copie des fichiers de configuration Maven (pour le cache des dépendances)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Donner les droits d'exécution au wrapper Maven
RUN chmod +x mvnw

# Téléchargement des dépendances (cette étape sera mise en cache si pom.xml ne change pas)
RUN ./mvnw dependency:go-offline

# Copie du code source
COPY src ./src

# Compilation du projet (sans lancer les tests pour gagner du temps)
RUN ./mvnw clean package -DskipTests

# ===============================
# ÉTAPE 2 : Run (Exécution)
# ===============================
# On utilise une image JRE plus légère pour l'exécution
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copie du fichier .jar généré depuis l'étape de build
# Le wildcard (*.jar) permet de prendre le fichier peu importe sa version
COPY --from=build /app/target/*.jar app.jar

# Exposition du port défini dans ton docker-compose
EXPOSE 8080

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"]