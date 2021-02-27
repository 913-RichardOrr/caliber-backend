/******************************************************
	Populate categories Table
******************************************************/

insert into categories (skill, active)  values ('React', true);
insert into categories (skill, active)  values ('Log4js', false);
insert into categories (skill, active)  values ('TypeScript', true);
insert into categories (skill, active)  values ('MongoDB', false);
insert into categories (skill, active)  values ('Jasmine', true);
insert into categories (skill, active)  values ('AWS Fargate', false);
insert into categories (skill, active)  values ('AWS Lambda', true);
insert into categories (skill, active)  values ('Jest', true);
insert into categories (skill, active)  values ('Enzyme', true);

/******************************************************
	Populate qcweeks Table
******************************************************/

insert into qcweeks (weekNumber, note, overallStatus, batchId)  values (1, '', 'Average', 'batch1');
insert into qcweeks (weekNumber, note, overallStatus, batchId)  values (5, 'They are making good progress.', 'Good', 'batch2');
insert into qcweeks (weekNumber, note, overallStatus, batchId)  values (1, '', 'Undefined', 'batch3');
insert into qcweeks (weekNumber, note, overallStatus, batchId)  values (10, '', 'Average', 'batch4');
insert into qcweeks (weekNumber, note, overallStatus, batchId)  values (3, 'Drop them all.', 'Poor', 'batch5');
insert into qcweeks (weekNumber, note, overallStatus, batchId)  values (6, '', 'Good', 'batch6');
insert into qcweeks (weekNumber, note, overallStatus, batchId)  values (3, '', 'Average', 'batch7');
insert into qcweeks (weekNumber, note, overallStatus, batchId)  values (8, 'They are doing their best.', 'Poor', 'batch8');
insert into qcweeks (weekNumber, note, overallStatus, batchId)  values (4, 'Savants. All of them.', 'Superstar', 'batch9');

/******************************************************
	Populate qcnotes Table
******************************************************/

insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (1, 'batch1', 'associate1', 'Undefined', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (1, 'batch1', 'associate2', 'Average', 'Seems okay so far.');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (1, 'batch2', 'associate3', 'Poor', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (1, 'batch2', 'associate4', 'Good', 'Shows promise.');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (1, 'batch3', 'associate5', 'Undefined', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (1, 'batch3', 'associate6', 'Average', 'Meh.');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (2, 'batch4', 'associate7', 'Average', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (2, 'batch4', 'associate8', 'Poor', 'One foot out the door.');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (2, 'batch5', 'associate9', 'Good', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (2, 'batch5', 'associate10', 'Average', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (2, 'batch6', 'associate11', 'Superstar', 'I like this guy.');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (1, 'batch6', 'associate12', 'Average', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (3, 'batch7', 'associate13', 'Good', 'Keep on truckin my dude.');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (3, 'batch7', 'associate14', 'Good', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (3, 'batch8', 'associate15', 'Poor', 'No Bueno.');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (3, 'batch8', 'associate16', 'Average', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (3, 'batch9', 'associate17', 'Average', '');
insert into qcnotes (weekNumber, batchId, associateId, technicalStatus, noteContent)  values (3, 'batch9', 'associate18', 'Superstar', 'Better than me.');