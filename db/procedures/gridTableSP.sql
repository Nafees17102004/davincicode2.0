DELIMITER $$

CREATE PROCEDURE GetAllProjects()
BEGIN
    SELECT 
        p.project_code,
        p.name AS project_name,
        l.name AS language_name,
        p.status,
        p.inactive_reason,
        COUNT(m.id) AS module_count
    FROM projects p
    JOIN languages l ON p.language_id = l.id
    LEFT JOIN modules m ON p.id = m.project_id
    GROUP BY p.id, p.project_code, p.name, l.name, p.status, p.inactive_reason
    ORDER BY p.project_code;
END$$

DELIMITER ;


CALL GetAllProjects();


DELIMITER $$

CREATE PROCEDURE GetProjectDetails(IN p_code VARCHAR(30))
BEGIN
    -- First return project details
    SELECT 
        p.project_code,
        p.name AS project_name,
        l.name AS language_name,
        p.status,
        p.inactive_reason
    FROM projects p
    JOIN languages l ON p.language_id = l.id
    WHERE p.project_code = p_code;

    -- Then return all modules for that project
    SELECT 
        m.id AS module_id,
        m.name AS module_name,
        m.status,
        m.inactive_reason
    FROM modules m
    JOIN projects p ON m.project_id = p.id
    WHERE p.project_code = p_code
    ORDER BY m.name;
END$$

DELIMITER ;


CALL GetProjectDetails('ERP001');