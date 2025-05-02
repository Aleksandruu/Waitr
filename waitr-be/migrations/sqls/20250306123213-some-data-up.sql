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
-- Corectare categorii și produse pentru 'The Caffe'
INSERT INTO public.Category (id, name, location_id) VALUES
    ('e8cbfea0-3767-4e09-9001-3a1863d45591', 'Coffee', '3f371f7a-0669-4587-a180-f6d815b58521'),
    ('59dcf2b7-2a02-4d2f-b054-456ad3d1e3cd', 'Breakfast', '3f371f7a-0669-4587-a180-f6d815b58521'),
    ('058cad4f-5e36-4db2-a6a2-27189d620fd6', 'Desserts', '3f371f7a-0669-4587-a180-f6d815b58521');

INSERT INTO public.Product (id, name, ingredients, nutrients, allergens, price, category_id, ready) VALUES
    ('b0d9c3b3-8c12-4fd4-8440-0cbaffd8e404', 'Espresso', 'Arabica coffee beans, water', 'Caffeine: 80mg', 'None', 3.50, 'e8cbfea0-3767-4e09-9001-3a1863d45591', 'barista'),
    ('46c9cc1f-4ff3-46f8-b23a-6b4412ebfa5d', 'Cappuccino', 'Espresso, steamed milk, foam', 'Calcium: 150mg, Caffeine: 80mg', 'Milk', 4.50, 'e8cbfea0-3767-4e09-9001-3a1863d45591', 'barista'),
    ('c1019d08-ecee-45c4-9331-236e04b8ef7c', 'Avocado Toast', 'Whole grain bread, avocado, cherry tomatoes, feta', 'Fiber: 8g, Protein: 10g', 'Gluten, Dairy', 8.90, '59dcf2b7-2a02-4d2f-b054-456ad3d1e3cd', 'cook'),
    ('33f43b58-788d-4261-96f4-1d685b5ebee5', 'Tiramisu', 'Ladyfingers, mascarpone, coffee, cocoa', 'Sugar: 25g, Fat: 18g', 'Gluten, Dairy, Eggs', 6.50, '058cad4f-5e36-4db2-a6a2-27189d620fd6', 'cook');

-- Corectare categorii și produse pentru 'The Bar'
INSERT INTO public.Category (id, name, location_id) VALUES
    ('29f5fd36-7dfb-4c4d-89d3-7ac4f49a0e55', 'Cocktails', 'd0707c7f-b03d-4194-8ac0-8f21d37af90b'),
    ('1d1f6e6f-8d25-4b18-88cd-6ea69fc08c66', 'Beers', 'd0707c7f-b03d-4194-8ac0-8f21d37af90b'),
    ('e3472169-1142-4dc4-9314-7aeefddedaa5', 'Snacks', 'd0707c7f-b03d-4194-8ac0-8f21d37af90b');

INSERT INTO public.Product (id, name, ingredients, nutrients, allergens, price, category_id, ready) VALUES
    ('b3f4e342-86a6-46c0-9d80-bb52f49a8132', 'Mojito', 'White rum, lime, mint, soda, sugar', 'Alcohol: 15%', 'None', 9.50, '29f5fd36-7dfb-4c4d-89d3-7ac4f49a0e55', 'barman'),
    ('06193eaf-5a9b-4ac9-9c0e-47f8398bdce4', 'IPA Beer', 'Hops, barley, yeast, water', 'Alcohol: 6.5%', 'Gluten', 6.00, '1d1f6e6f-8d25-4b18-88cd-6ea69fc08c66', 'ready'),
    ('56d273d6-3611-4237-9473-25cf0d774bf5', 'Nachos', 'Tortilla chips, cheese, jalapeños, salsa', 'Calories: 450, Fat: 22g', 'Dairy', 7.50, 'e3472169-1142-4dc4-9314-7aeefddedaa5', 'cook');

-- Corectare categorii și produse pentru 'The Bistro'
INSERT INTO public.Category (id, name, location_id) VALUES
    ('fa94fd3e-c712-46e3-8e25-d2bc4c0c2e4d', 'Main Courses', 'cd4c6978-d519-463d-ae98-55c6fec6a322'),
    ('8023b9c9-89fd-45ae-9333-42cd2972752a', 'Salads', 'cd4c6978-d519-463d-ae98-55c6fec6a322'),
    ('72b9468a-4d53-4c93-8ed4-97b53c7998df', 'Wines', 'cd4c6978-d519-463d-ae98-55c6fec6a322');

INSERT INTO public.Product (id, name, ingredients, nutrients, allergens, price, category_id, ready) VALUES
    ('e1bb87e3-e9d7-4c3a-9f83-2ff34ed800b7', 'Beef Bourguignon', 'Beef, red wine, mushrooms, onions, carrots', 'Protein: 35g, Calories: 550', 'None', 18.90, 'fa94fd3e-c712-46e3-8e25-d2bc4c0c2e4d', 'cook'),
    ('387d9c01-13cf-4a99-bd1e-d44a018bb0e9', 'Caesar Salad', 'Romaine lettuce, croutons, parmesan, Caesar dressing', 'Calories: 320, Fat: 18g', 'Gluten, Dairy, Eggs', 10.50, '8023b9c9-89fd-45ae-9333-42cd2972752a', 'cook'),
    ('7be62cb2-7f41-4d93-bca4-6237f3f5313e', 'Pinot Noir', 'Pinot noir grapes', 'Alcohol: 13.5%', 'Sulfites', 8.50, '72b9468a-4d53-4c93-8ed4-97b53c7998df', 'ready'),
    ('f89b1402-c6a2-4ac6-82ce-d456e0fd2761', 'Grilled Salmon', 'Salmon fillet, lemon, herbs', 'Omega-3: 2.5g, Protein: 30g', 'Fish', 16.50, 'fa94fd3e-c712-46e3-8e25-d2bc4c0c2e4d', 'cook');
