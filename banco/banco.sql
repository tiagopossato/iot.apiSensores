DROP TABLE IF EXISTS "Alarmes";
CREATE TABLE "Alarmes" (
	"idAlarme" INTEGER NOT NULL ,
	"idCentral" INTEGER NOT NULL ,
	"mensagem" VARCHAR(255),
	"prioridade" INTEGER NOT NULL ,
	"ativo" BOOL NOT NULL ,
	"tempoAtivacao" DATETIME NOT NULL ,
	"tempoInativacao" DATETIME,
	"reconhecido" BOOL NOT NULL ,
	"tempoReconhecido" DATETIME,
	"mensagemReconhecido" VARCHAR(255),
	FOREIGN KEY(idCentral) REFERENCES Central(id),
	CONSTRAINT Alarmes_pkey PRIMARY KEY (idAlarme, idCentral)
);
DROP TABLE IF EXISTS "Central";
CREATE TABLE "Central" ("id" INTEGER PRIMARY KEY  NOT NULL ,"uuid" BLOB,"nome" VARCHAR(255),"created_at" DATETIME DEFAULT (CURRENT_TIMESTAMP) ,"updated_at" DATETIME DEFAULT (CURRENT_TIMESTAMP) );
INSERT INTO "Central" VALUES(1,'ee534ac3-16ad-49c7-985a-5a198f6a96d7','Central da Estufa','2016-12-10 17:35:01','2016-12-10 17:35:01');
INSERT INTO "Central" VALUES(3,'c33cdfab-90b0-438d-b819-0b4015a1847c','Câmara das Trutas','2016-12-10 18:51:30','2016-12-10 18:51:30');
INSERT INTO "Central" VALUES(4,'d2688972-c475-4829-b8ca-d530133b1f41','Balcão de refrigeração','2016-12-10 19:02:46','2016-12-10 19:02:46');
