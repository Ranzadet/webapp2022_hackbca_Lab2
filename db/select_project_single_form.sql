SELECT 
	project.project_id as project_id, 
    project_name, 
    project_owner,
    project_members,
    project_type_id,
    project_language_id,
    project_description,
    DATE_FORMAT(project_date, '%m-%d-%Y') as project_date
FROM 
	project 
WHERE
	project.project_id = ?
LIMIT 1