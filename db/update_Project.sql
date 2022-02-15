UPDATE project
SET
    project_name = ?,
    project_owner = ?,  
    project_members = ?, 
    project_type_id = ?,
    project_language_id = ?, 
    project_description = ?,
    project_date = STR_TO_DATE(?,'%Y-%m-%d')
WHERE
	project_id = ?
;