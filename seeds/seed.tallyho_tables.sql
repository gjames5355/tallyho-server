BEGIN;

TRUNCATE
    tallyho_tasks,
    tallyho_users
    RESTART IDENTITY CASCADE;

INSERT INTO tallyho_users (email, password)
VALUES
    ('tallyho_user@gmail.com', '$2a$12$aqR1Q2QjN55nHcE7gWDLVOCQ.ASYP6B48fBLVMY2r9hyw4zVFGDBS');

INSERT INTO tallyho_tasks (title, image, user_id, checked)
VALUES
    ('Brush Teeth', 'https://www.childrensdentistmiami.com/files/dca-blog_make-kids-smile-about-brushing.jpg', 1, false),
    ('Breakfast', 'https://i2-prod.mirror.co.uk/incoming/article10151139.ece/ALTERNATES/s615b/JS116022051.jpg', 1, false),
    ('Dress Up', 'https://metro.co.uk/wp-content/uploads/2018/10/sei_35764206-a721.jpg?quality=90&strip=all', 1, false),
    ('Wait for School Bus', 'https://burnettwilliams.com/wp-content/uploads/2019/08/2019_08_22_children_cuing_for_the_school_bus_WP.jpg', 1, false),
    ('School', 'http://www.takepart.com/sites/default/files/styles/large/public/teacher-late-start-2.jpg', 1, false),
    ('Park', 'https://media.timeout.com/images/105265606/630/472/image.jpg', 1, false);

COMMIT;