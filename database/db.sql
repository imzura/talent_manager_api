-- Tabla de disciplinas
CREATE TABLE disciplines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);

-- Tabla de trabajadores
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    document VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(150),
    skills TEXT,
    discipline_id INTEGER NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_discipline
        FOREIGN KEY(discipline_id)
        REFERENCES disciplines(id)
        ON DELETE RESTRICT
);

-- Índice para mejorar consultas por disciplina
CREATE INDEX idx_employees_discipline
ON employees(discipline_id);

-- INSERCIONES DE EJEMPLO

-- Datos de ejemplo para disciplinas
INSERT INTO disciplines (name, description) VALUES
('Ingeniería de Software', 'Disciplina que se enfoca en el desarrollo de software de alta calidad.'),
('Diseño Gráfico', 'Disciplina que se enfoca en la creación de contenido visual.'),
('Marketing Digital', 'Disciplina que se enfoca en la promoción de productos o servicios a través de medios digitales.');

-- Datos de ejemplo para empleados
INSERT INTO employees (name, document, email, role, skills, discipline_id) VALUES
('Juan Pérez', '12345678', 'juan.perez@example.com', 'Desarrollador', 'Python, Java, SQL', 1),
('María Gómez', '87654321', 'maria.gomez@example.com', 'Diseñadora', 'UI/UX, Figma, Adobe XD, Photoshop', 2),
('Carlos López', '11223344', 'carlos.lopez@example.com', 'Especialista', 'Google Analytics, SEMrush, Ahrefs', 3),
('Ana Martínez', '44332211', 'ana.martinez@example.com', 'Analista', 'Data Science, Python, R, SQL', 1),
('Luis Rodríguez', '55667788', 'luis.rodriguez@example.com', 'Diseñador', 'Motion Design, After Effects, Blender, Cinema 4D', 2),
('Sofía García', '99887766', 'sofia.garcia@example.com', 'Diseñadora', 'Branding, Illustrator, InDesign, CorelDRAW', 2),
('Miguel Hernández', '66778899', 'miguel.hernandez@example.com', 'Especialista', 'Content Marketing, WordPress, HubSpot, Mailchimp', 3);  
