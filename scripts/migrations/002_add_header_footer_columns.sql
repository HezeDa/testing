-- Добавляем колонки для шапки сайта
ALTER TABLE settings
ADD COLUMN header_phone VARCHAR(255),
ADD COLUMN header_email VARCHAR(255),
ADD COLUMN show_social_in_header BOOLEAN DEFAULT true;

-- Добавляем колонки для подвала сайта
ALTER TABLE settings
ADD COLUMN footer_description TEXT,
ADD COLUMN footer_copyright TEXT,
ADD COLUMN show_social_in_footer BOOLEAN DEFAULT true,
ADD COLUMN show_contact_in_footer BOOLEAN DEFAULT true,
ADD COLUMN show_working_hours_in_footer BOOLEAN DEFAULT true; 