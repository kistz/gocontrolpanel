CREATE DATABASE IF NOT EXISTS `gocontrolpanel`;

CREATE USER IF NOT EXISTS 'gocontrolpanel'@'%' IDENTIFIED BY 'VettePanel123';
GRANT ALL PRIVILEGES ON `gocontrolpanel`.* TO 'gocontrolpanel'@'%';
FLUSH PRIVILEGES;