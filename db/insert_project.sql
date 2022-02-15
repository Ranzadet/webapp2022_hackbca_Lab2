INSERT INTO `project` 
(`project_name`, `project_owner`, `project_members`, `project_type_id`, `project_language_id`, `project_description`, `project_date`)
VALUES 
(?, ?, ?, ?, ?, ?, STR_TO_DATE(?, '%m-%d-%Y'))
