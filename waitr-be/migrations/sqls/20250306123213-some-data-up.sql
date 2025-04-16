INSERT INTO
    public.Location (id, slug, name, color)
VALUES
    (
        '82f68e6f-3ddb-43cd-a916-83bf5e043b52',
        'admin',
        'AdminLocation',
        '#086400'
    );

INSERT INTO
    public.User (name, role, password, location_id)
VALUES
    (
        'admin',
        'admin',
        '$2a$12$Re45hLu9p6lTW7a4lrqwq.yMAJFFuDD4hXVNDVLs.zf7Heq35rrMS',
        '82f68e6f-3ddb-43cd-a916-83bf5e043b52'
    );

INSERT INTO
    public.Location (id, slug, name, color)
VALUES
    (
        '3f371f7a-0669-4587-a180-f6d815b58521',
        'the-caffe',
        'The Caffe',
        '#086400'
    );

INSERT INTO
    public.User (name, role, password, location_id)
VALUES
    (
        'manager_caffe',
        'manager',
        '$2a$12$Re45hLu9p6lTW7a4lrqwq.yMAJFFuDD4hXVNDVLs.zf7Heq35rrMS',
        '3f371f7a-0669-4587-a180-f6d815b58521'
    );

INSERT INTO
    public.Location (id, slug, name, color)
VALUES
    (
        'd0707c7f-b03d-4194-8ac0-8f21d37af90b',
        'the-bar',
        'The Bar',
        '#086400'
    );

INSERT INTO
    public.User (name, role, password, location_id)
VALUES
    (
        'manager_bar',
        'manager',
        '$2a$12$Re45hLu9p6lTW7a4lrqwq.yMAJFFuDD4hXVNDVLs.zf7Heq35rrMS',
        'd0707c7f-b03d-4194-8ac0-8f21d37af90b'
    );

INSERT INTO
    public.Location (id, slug, name, color)
VALUES
    (
        'cd4c6978-d519-463d-ae98-55c6fec6a322',
        'the-bistro',
        'The Bistro',
        '#086400'
    );

INSERT INTO
    public.User (name, role, password, location_id)
VALUES
    (
        'manager_bistro',
        'manager',
        '$2a$12$Re45hLu9p6lTW7a4lrqwq.yMAJFFuDD4hXVNDVLs.zf7Heq35rrMS',
        'cd4c6978-d519-463d-ae98-55c6fec6a322'
    );