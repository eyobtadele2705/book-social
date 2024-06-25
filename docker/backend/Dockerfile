# Build stage
FROM maven:3.8.7-openjdk-18 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:17
ARG PROFILE=dev
ARG APP_VERSION=1.0.1

WORKDIR /app
COPY --from=build /build/target/spring-book-*.jar /app/

EXPOSE 8088

ENV DB_URL=jdbc:postgresql://postgresql-book-cont:5432/book_network_db
ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}

CMD java -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL} -jar spring-book-${JAR_VERSION}.jar