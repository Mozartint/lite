insert into restaurants (name, slug)
values ('Demo Restoran', 'demo-restoran')
on conflict (slug) do nothing;

with r as (
  select id from restaurants where slug = 'demo-restoran'
), inserted_categories as (
  insert into categories (restaurant_id, name, sort_order)
  select r.id, x.name, x.sort_order
  from r,
  (values
    ('Burgerler', 1),
    ('İçecekler', 2),
    ('Tatlılar', 3)
  ) as x(name, sort_order)
  on conflict do nothing
  returning id, name, restaurant_id
)
insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
select c.restaurant_id, c.id, i.name, i.description, i.price, i.sort_order
from (
  select id, name, restaurant_id from categories where restaurant_id = (select id from restaurants where slug = 'demo-restoran')
) c
join (
  values
    ('Burgerler', 'Classic Burger', 'Cheddar, karamelize soğan, özel sos', 265.00, 1),
    ('Burgerler', 'Crispy Chicken Burger', 'Pane tavuk, marul, ranch', 245.00, 2),
    ('İçecekler', 'Kola', '33 cl', 55.00, 1),
    ('İçecekler', 'Ayran', '30 cl', 35.00, 2),
    ('Tatlılar', 'San Sebastian', 'Çikolata soslu', 145.00, 1)
) as i(category_name, name, description, price, sort_order)
  on i.category_name = c.name
where not exists (
  select 1 from menu_items m where m.restaurant_id = c.restaurant_id and m.name = i.name
);
