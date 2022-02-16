SELECT
    project.project_id as project_id,
    project_name,
    project_owner,
    project_members,
    project_description,
    DATE_FORMAT(project_date, '%Y-%m-%d') as project_date,
    project_type,
    project_language
FROM
    project, project_language, project_type
WHERE
    project_language.project_language_id = project.project_language_id
    and project.project_type_id = project_type.project_type_id
