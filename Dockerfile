FROM tomcat:9.0-jdk15
COPY hw2.war /usr/local/tomcat/webapps
EXPOSE 80