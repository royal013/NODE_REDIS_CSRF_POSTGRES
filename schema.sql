CREATE TABLE register_user (
    id  SERIAL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number BIGINT,
    age INT,
    state VARCHAR(255),
    daily_limit INT,
    campaign_limit INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table coupons(
    id SERIAL,
    coupon VARCHAR(255),
    type VARCHAR(255),
    user_id VARCHAR(255) DEFAULT NULL,
    is_used int DEFAULT 0,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE gift_card(
    id SERIAL,
    product_name VARCHAR(255),
    amount BIGINT,
    Gift_card_number BIGINT,
    State VARCHAR(255),
    validity DATE,
    card_pin BIGINT,
    terms_condition VARCHAR(500),
    currency_code VARCHAR(255),
    user_id INT DEFAULT NULL,
    is_used INT DEFAULT 0,
    redemeed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE state_detail(
    id serial,
    state VARCHAR(255),
    quart INT,
    pint INT,
    nip INT,
    isActive int DEFAULT 0
);


create table batchcode(
    id SERIAL,
    batch_code VARCHAR(255),
    state VARCHAR(255),
    user_id INT,
    redemmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active INT
);


SELECT * FROM public.gift_card where amount=40 and is_used=0 AND state='TR' order by RANDOM() LIMIT(1)
