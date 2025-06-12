INSERT INTO
    public.Location (id, slug, name, color, tables)
VALUES
    (
        '82f68e6f-3ddb-43cd-a916-83bf5e043b52',
        'admin',
        'AdminLocation',
        'hsl(118, 46%, 26%)',
        0
    );

INSERT INTO
    public.User (username, role, password, location_id)
VALUES
    (
        'admin',
        'admin',
        '$2a$12$Re45hLu9p6lTW7a4lrqwq.yMAJFFuDD4hXVNDVLs.zf7Heq35rrMS',
        '82f68e6f-3ddb-43cd-a916-83bf5e043b52'
    );

INSERT INTO
    public.Location (id, slug, name, color, tables)
VALUES
    (
        '3f371f7a-0669-4587-a180-f6d815b58521',
        'the-caffe',
        'The Caffe',
        'hsl(118, 46%, 26%)',
        6
    );

INSERT INTO
    public.User (username, role, password, location_id)
VALUES
    (
        'manager_caffe',
        'manager',
        '$2a$12$Re45hLu9p6lTW7a4lrqwq.yMAJFFuDD4hXVNDVLs.zf7Heq35rrMS',
        '3f371f7a-0669-4587-a180-f6d815b58521'
    );

INSERT INTO
    public.Location (id, slug, name, color, tables)
VALUES
    (
        'd0707c7f-b03d-4194-8ac0-8f21d37af90b',
        'the-bar',
        'The Bar',
        'hsl(118, 46%, 26%)',
        8
    );

INSERT INTO
    public.User (username, role, password, location_id)
VALUES
    (
        'manager_bar',
        'manager',
        '$2a$12$Re45hLu9p6lTW7a4lrqwq.yMAJFFuDD4hXVNDVLs.zf7Heq35rrMS',
        'd0707c7f-b03d-4194-8ac0-8f21d37af90b'
    );

INSERT INTO
    public.Location (id, slug, name, color, tables)
VALUES
    (
        'cd4c6978-d519-463d-ae98-55c6fec6a322',
        'the-bistro',
        'The Bistro',
        'hsl(118, 46%, 26%)',
        12
    );

INSERT INTO
    public.User (username, role, password, location_id)
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

INSERT INTO public.Product (id, name, ingredients, nutrients, allergens, price, category_id, initial_status) VALUES
    ('b0d9c3b3-8c12-4fd4-8440-0cbaffd8e404', 'Espresso', 'Arabica coffee beans, water', 'Caffeine: 80mg', 'None', 3.50, 'e8cbfea0-3767-4e09-9001-3a1863d45591', 'barista'),
    ('46c9cc1f-4ff3-46f8-b23a-6b4412ebfa5d', 'Cappuccino', 'Espresso, steamed milk, foam', 'Calcium: 150mg, Caffeine: 80mg', 'Milk', 4.50, 'e8cbfea0-3767-4e09-9001-3a1863d45591', 'barista'),
    ('c1019d08-ecee-45c4-9331-236e04b8ef7c', 'Avocado Toast', 'Whole grain bread, avocado, cherry tomatoes, feta', 'Fiber: 8g, Protein: 10g', 'Gluten, Dairy', 8.90, '59dcf2b7-2a02-4d2f-b054-456ad3d1e3cd', 'cook'),
    ('33f43b58-788d-4261-96f4-1d685b5ebee5', 'Tiramisu', 'Ladyfingers, mascarpone, coffee, cocoa', 'Sugar: 25g, Fat: 18g', 'Gluten, Dairy, Eggs', 6.50, '058cad4f-5e36-4db2-a6a2-27189d620fd6', 'cook');

-- Corectare categorii și produse pentru 'The Bar'
INSERT INTO public.Category (id, name, location_id) VALUES
    ('c1f5fd36-7dfb-4c4d-89d3-7ac4f49a0e01', 'Coffees',  'd0707c7f-b03d-4194-8ac0-8f21d37af90b'),
    ('c2e2e56f-8d25-4b18-88cd-6ea69fc08c02', 'Beers',    'd0707c7f-b03d-4194-8ac0-8f21d37af90b'),
    ('c3d34721-1142-4dc4-9314-7aeefddedaa5', 'Cocktails','d0707c7f-b03d-4194-8ac0-8f21d37af90b'),
    ('c4a349b9-5572-4c38-9714-a2bef6ef08c3', 'Snacks',   'd0707c7f-b03d-4194-8ac0-8f21d37af90b'),
    ('c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'Mains',    'd0707c7f-b03d-4194-8ac0-8f21d37af90b'),
    ('c6c8879d-3e22-4e27-a2bc-e659f7de9f6f', 'Desserts', 'd0707c7f-b03d-4194-8ac0-8f21d37af90b');

-- Insert products (~40)
INSERT INTO public.Product (id, name, ingredients, nutrients, allergens, price, category_id, initial_status) VALUES
    -- Coffees (5)
    ('a11e342b-86a6-46c0-9d80-bb52f49a8001', 'Espresso',              'Coffee beans, water',                                     'Calories: 5, Caffeine: 63mg',         'None',             2.50, 'c1f5fd36-7dfb-4c4d-89d3-7ac4f49a0e01', 'ready'),
    ('a12e342b-86a6-46c0-9d80-bb52f49a8002', 'Americano',             'Espresso, hot water',                                     'Calories: 10, Caffeine: 63mg',        'None',             3.00, 'c1f5fd36-7dfb-4c4d-89d3-7ac4f49a0e01', 'ready'),
    ('a13e342b-86a6-46c0-9d80-bb52f49a8003', 'Cappuccino',            'Espresso, steamed milk, milk foam',                       'Calories: 120, Fat: 4g',              'Dairy',            3.50, 'c1f5fd36-7dfb-4c4d-89d3-7ac4f49a0e01', 'ready'),
    ('a14e342b-86a6-46c0-9d80-bb52f49a8004', 'Latte',                 'Espresso, steamed milk',                                  'Calories: 150, Fat: 5g',              'Dairy',            3.75, 'c1f5fd36-7dfb-4c4d-89d3-7ac4f49a0e01', 'ready'),
    ('a15e342b-86a6-46c0-9d80-bb52f49a8005', 'Mocha',                 'Espresso, chocolate syrup, steamed milk, whipped cream',  'Calories: 200, Fat: 7g',              'Dairy',            4.00, 'c1f5fd36-7dfb-4c4d-89d3-7ac4f49a0e01', 'ready'),
    
    -- Beers (6)
    ('b11e342b-86a6-46c0-9d80-bb52f49a8006', 'Pilsner',               'Water, barley, hops, yeast',                              'Alcohol: 5%',                         'Gluten',           5.50, 'c2e2e56f-8d25-4b18-88cd-6ea69fc08c02', 'ready'),
    ('b12e342b-86a6-46c0-9d80-bb52f49a8007', 'IPA Beer',              'Water, barley, hops, yeast',                              'Alcohol: 6.5%',                       'Gluten',           6.00, 'c2e2e56f-8d25-4b18-88cd-6ea69fc08c02', 'ready'),
    ('b13e342b-86a6-46c0-9d80-bb52f49a8008', 'Stout',                 'Water, roasted barley, hops, yeast',                      'Alcohol: 5.8%',                       'Gluten',           6.50, 'c2e2e56f-8d25-4b18-88cd-6ea69fc08c02', 'ready'),
    ('b14e342b-86a6-46c0-9d80-bb52f49a8009', 'Wheat Beer',            'Water, wheat malt, barley, hops, yeast',                  'Alcohol: 5.2%',                       'Gluten',           5.75, 'c2e2e56f-8d25-4b18-88cd-6ea69fc08c02', 'ready'),
    ('b15e342b-86a6-46c0-9d80-bb52f49a8010', 'Lager',                 'Water, barley, hops, yeast',                              'Alcohol: 4.8%',                       'Gluten',           5.25, 'c2e2e56f-8d25-4b18-88cd-6ea69fc08c02', 'ready'),
    ('b16e342b-86a6-46c0-9d80-bb52f49a8011', 'Amber Ale',             'Water, barley malt, hops, yeast',                         'Alcohol: 5.5%',                       'Gluten',           6.25, 'c2e2e56f-8d25-4b18-88cd-6ea69fc08c02', 'ready'),
    
    -- Cocktails (7)
    ('c11e342b-86a6-46c0-9d80-bb52f49a8012', 'Margarita',             'Tequila, triple sec, lime juice, salt',                   'Alcohol: 13%',                        'None',             10.00,'c3d34721-1142-4dc4-9314-7aeefddedaa5', 'barman'),
    ('c12e342b-86a6-46c0-9d80-bb52f49a8013', 'Old Fashioned',         'Bourbon, sugar, bitters, orange peel',                    'Alcohol: 21%',                        'None',             11.50,'c3d34721-1142-4dc4-9314-7aeefddedaa5', 'barman'),
    ('c13e342b-86a6-46c0-9d80-bb52f49a8014', 'Martini',               'Gin, dry vermouth, olive',                                'Alcohol: 30%',                        'None',             12.00,'c3d34721-1142-4dc4-9314-7aeefddedaa5', 'barman'),
    ('c14e342b-86a6-46c0-9d80-bb52f49a8015', 'Cosmopolitan',          'Vodka, triple sec, cranberry juice, lime juice',         'Alcohol: 15%',                        'None',             10.50,'c3d34721-1142-4dc4-9314-7aeefddedaa5', 'barman'),
    ('c15e342b-86a6-46c0-9d80-bb52f49a8016', 'Negroni',               'Gin, Campari, sweet vermouth',                            'Alcohol: 24%',                        'None',             11.00,'c3d34721-1142-4dc4-9314-7aeefddedaa5', 'barman'),
    ('c16e342b-86a6-46c0-9d80-bb52f49a8017', 'Moscow Mule',           'Vodka, ginger beer, lime juice',                          'Alcohol: 14%',                        'None',             10.00,'c3d34721-1142-4dc4-9314-7aeefddedaa5', 'barman'),
    ('c17e342b-86a6-46c0-9d80-bb52f49a8018', 'Piña Colada',           'Rum, coconut cream, pineapple juice',                     'Alcohol: 15%',                        'None',             9.50, 'c3d34721-1142-4dc4-9314-7aeefddedaa5', 'barman'),
    
    -- Snacks (6)
    ('d11e342b-86a6-46c0-9d80-bb52f49a8019', 'Nachos',                'Tortilla chips, cheese, jalapeños, salsa',               'Calories: 450, Fat: 22g',             'Dairy',            7.50, 'c4a349b9-5572-4c38-9714-a2bef6ef08c3', 'cook'),
    ('d12e342b-86a6-46c0-9d80-bb52f49a8020', 'French Fries',          'Potatoes, salt, oil',                                    'Calories: 365, Fat: 17g',             'None',             4.00, 'c4a349b9-5572-4c38-9714-a2bef6ef08c3', 'cook'),
    ('d13e342b-86a6-46c0-9d80-bb52f49a8021', 'Onion Rings',           'Onions, batter, oil',                                    'Calories: 320, Fat: 15g',             'None',             5.00, 'c4a349b9-5572-4c38-9714-a2bef6ef08c3', 'cook'),
    ('d14e342b-86a6-46c0-9d80-bb52f49a8022', 'Chicken Wings',         'Chicken wings, spices, sauce',                           'Calories: 550, Protein: 30g',         'None',             8.00, 'c4a349b9-5572-4c38-9714-a2bef6ef08c3', 'cook'),
    ('d15e342b-86a6-46c0-9d80-bb52f49a8023', 'Mozzarella Sticks',     'Mozzarella cheese, bread crumbs, oil',                   'Calories: 300, Fat: 20g',             'Dairy',            6.00, 'c4a349b9-5572-4c38-9714-a2bef6ef08c3', 'cook'),
    ('d16e342b-86a6-46c0-9d80-bb52f49a8024', 'Mixed Nuts',            'Almonds, cashews, peanuts',                              'Calories: 250, Fat: 22g',             'Tree Nuts, Peanuts',5.50, 'c4a349b9-5572-4c38-9714-a2bef6ef08c3', 'ready'),
    
    -- Mains (10)
    ('e11e342b-86a6-46c0-9d80-bb52f49a8025', 'Cheeseburger',          'Beef patty, cheese, lettuce, tomato, bun',               'Calories: 750, Protein: 40g',         'Gluten, Dairy',    9.00, 'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'cook'),
    ('e12e342b-86a6-46c0-9d80-bb52f49a8026', 'Margherita Pizza',      'Pizza dough, tomato sauce, mozzarella, basil',           'Calories: 800, Carbs: 90g',           'Gluten, Dairy',   11.00, 'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'cook'),
    ('e13e342b-86a6-46c0-9d80-bb52f49a8027', 'Caesar Salad',          'Romaine lettuce, croutons, Parmesan, Caesar dressing',  'Calories: 450, Fat: 30g',             'Gluten, Dairy, Fish',7.50,'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'ready'),
    ('e14e342b-86a6-46c0-9d80-bb52f49a8028', 'Fish & Chips',          'Cod, potatoes, batter, oil',                            'Calories: 900, Protein: 45g',         'Gluten, Fish',    12.00, 'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'cook'),
    ('e15e342b-86a6-46c0-9d80-bb52f49a8029', 'Grilled Chicken Sandwich','Chicken breast, lettuce, tomato, bun',                  'Calories: 600, Protein: 35g',         'Gluten',           8.50, 'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'cook'),
    ('e16e342b-86a6-46c0-9d80-bb52f49a8030', 'Pasta Carbonara',       'Pasta, eggs, pancetta, Parmesan',                        'Calories: 650, Protein: 25g',         'Gluten, Dairy, Pork',10.50,'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'cook'),
    ('e17e342b-86a6-46c0-9d80-bb52f49a8031', 'Vegan Buddha Bowl',     'Quinoa, chickpeas, veggies, tahini sauce',              'Calories: 550, Protein: 20g',         'Sesame',           9.00, 'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'ready'),
    ('e18e342b-86a6-46c0-9d80-bb52f49a8032', 'Beef Tacos',            'Tortillas, beef, lettuce, cheese, salsa',               'Calories: 500, Protein: 25g',         'Gluten, Dairy',    8.00, 'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'cook'),
    ('e19e342b-86a6-46c0-9d80-bb52f49a8033', 'Salmon Teriyaki',       'Salmon, teriyaki sauce, rice, veggies',                 'Calories: 600, Protein: 30g',         'Fish, Soy',       13.50, 'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'cook'),
    ('e20e342b-86a6-46c0-9d80-bb52f49a8034', 'Tofu Stir Fry',         'Tofu, veggies, soy sauce, rice',                        'Calories: 500, Protein: 22g',         'Soy',              9.50, 'c5b7648a-2b11-4c54-bf9e-3d1a2a3c4d5e', 'cook'),
    
    -- Desserts (6)
    ('f11e342b-86a6-46c0-9d80-bb52f49a8035', 'Cheesecake',            'Cream cheese, sugar, eggs, graham cracker crust',       'Calories: 450, Fat: 30g',             'Dairy, Gluten',    5.50, 'c6c8879d-3e22-4e27-a2bc-e659f7de9f6f', 'ready'),
    ('f12e342b-86a6-46c0-9d80-bb52f49a8036', 'Chocolate Brownie',      'Chocolate, flour, sugar, eggs',                         'Calories: 400, Carbs: 50g',           'Gluten, Eggs',     4.50, 'c6c8879d-3e22-4e27-a2bc-e659f7de9f6f', 'ready'),
    ('f13e342b-86a6-46c0-9d80-bb52f49a8037', 'Tiramisu',              'Mascarpone, coffee, ladyfingers, cocoa',                'Calories: 500, Fat: 32g',             'Dairy, Gluten, Eggs',6.00,'c6c8879d-3e22-4e27-a2bc-e659f7de9f6f', 'ready'),
    ('f14e342b-86a6-46c0-9d80-bb52f49a8038', 'Fruit Salad',           'Mixed fruits, mint',                                    'Calories: 120, Fiber: 5g',            'None',             4.00, 'c6c8879d-3e22-4e27-a2bc-e659f7de9f6f', 'ready'),
    ('f15e342b-86a6-46c0-9d80-bb52f49a8039', 'Ice Cream Sundae',      'Ice cream, chocolate sauce, nuts, whipped cream',       'Calories: 600, Fat: 35g',             'Dairy, Tree Nuts', 5.00, 'c6c8879d-3e22-4e27-a2bc-e659f7de9f6f', 'ready'),
    ('f16e342b-86a6-46c0-9d80-bb52f49a8040', 'Panna Cotta',           'Cream, sugar, vanilla, gelatin',                        'Calories: 300, Fat: 18g',             'Dairy',            5.50, 'c6c8879d-3e22-4e27-a2bc-e659f7de9f6f', 'ready');

-- Corectare categorii și produse pentru 'The Bistro'
INSERT INTO public.Category (id, name, location_id) VALUES
    ('fa94fd3e-c712-46e3-8e25-d2bc4c0c2e4d', 'Main Courses', 'cd4c6978-d519-463d-ae98-55c6fec6a322'),
    ('8023b9c9-89fd-45ae-9333-42cd2972752a', 'Salads', 'cd4c6978-d519-463d-ae98-55c6fec6a322'),
    ('72b9468a-4d53-4c93-8ed4-97b53c7998df', 'Wines', 'cd4c6978-d519-463d-ae98-55c6fec6a322');

INSERT INTO public.Product (id, name, ingredients, nutrients, allergens, price, category_id, initial_status) VALUES
    ('e1bb87e3-e9d7-4c3a-9f83-2ff34ed800b7', 'Beef Bourguignon', 'Beef, red wine, mushrooms, onions, carrots', 'Protein: 35g, Calories: 550', 'None', 18.90, 'fa94fd3e-c712-46e3-8e25-d2bc4c0c2e4d', 'cook'),
    ('387d9c01-13cf-4a99-bd1e-d44a018bb0e9', 'Caesar Salad', 'Romaine lettuce, croutons, parmesan, Caesar dressing', 'Calories: 320, Fat: 18g', 'Gluten, Dairy, Eggs', 10.50, '8023b9c9-89fd-45ae-9333-42cd2972752a', 'cook'),
    ('7be62cb2-7f41-4d93-bca4-6237f3f5313e', 'Pinot Noir', 'Pinot noir grapes', 'Alcohol: 13.5%', 'Sulfites', 8.50, '72b9468a-4d53-4c93-8ed4-97b53c7998df', 'ready'),
    ('f89b1402-c6a2-4ac6-82ce-d456e0fd2761', 'Grilled Salmon', 'Salmon fillet, lemon, herbs', 'Omega-3: 2.5g, Protein: 30g', 'Fish', 16.50, 'fa94fd3e-c712-46e3-8e25-d2bc4c0c2e4d', 'cook');
