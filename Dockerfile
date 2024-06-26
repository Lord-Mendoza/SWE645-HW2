FROM tomcat:10.1.14-jdk17
COPY hw2.war /usr/local/tomcat/webapps/
EXPOSE 8080
CMD ["catalina.sh", "run"]