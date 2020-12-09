--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1 (Ubuntu 13.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.1 (Ubuntu 13.1-1.pgdg20.04+1)

-- Started on 2020-12-09 16:09:52 WIB

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 16549)
-- Name: iklan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.iklan (
    idiklan integer NOT NULL,
    kategori character varying NOT NULL,
    judul character varying NOT NULL,
    luastanah character varying NOT NULL,
    luasbangunan character varying NOT NULL,
    kamartidur character varying NOT NULL,
    kamarmandi character varying NOT NULL,
    lantai character varying NOT NULL,
    fasilitas character varying NOT NULL,
    carport character varying NOT NULL,
    sertifikasi character varying NOT NULL,
    harga character varying NOT NULL,
    gambar bytea,
    deskripsi character varying NOT NULL,
    provinsi character varying NOT NULL,
    kota character varying NOT NULL,
    alamat character varying NOT NULL,
    iduser integer NOT NULL,
    lat real,
    lng real
);


--
-- TOC entry 202 (class 1259 OID 16547)
-- Name: iklan_idiklan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.iklan_idiklan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3037 (class 0 OID 0)
-- Dependencies: 202
-- Name: iklan_idiklan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.iklan_idiklan_seq OWNED BY public.iklan.idiklan;


--
-- TOC entry 207 (class 1259 OID 24777)
-- Name: kota; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kota (
    idkota integer NOT NULL,
    namakota character varying NOT NULL,
    idprovinsi integer NOT NULL
);


--
-- TOC entry 206 (class 1259 OID 24775)
-- Name: kota_idkota_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kota_idkota_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3038 (class 0 OID 0)
-- Dependencies: 206
-- Name: kota_idkota_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kota_idkota_seq OWNED BY public.kota.idkota;


--
-- TOC entry 205 (class 1259 OID 24766)
-- Name: provinsi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provinsi (
    idprovinsi integer NOT NULL,
    namaprovinsi character varying NOT NULL
);


--
-- TOC entry 204 (class 1259 OID 24764)
-- Name: provinsi_idprovinsi_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.provinsi_idprovinsi_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3039 (class 0 OID 0)
-- Dependencies: 204
-- Name: provinsi_idprovinsi_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.provinsi_idprovinsi_seq OWNED BY public.provinsi.idprovinsi;


--
-- TOC entry 201 (class 1259 OID 16448)
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    iduser integer NOT NULL,
    nama character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    nohandphone character varying NOT NULL
);


--
-- TOC entry 200 (class 1259 OID 16446)
-- Name: user_iduser_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_iduser_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3040 (class 0 OID 0)
-- Dependencies: 200
-- Name: user_iduser_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_iduser_seq OWNED BY public."user".iduser;


--
-- TOC entry 2881 (class 2604 OID 16552)
-- Name: iklan idiklan; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iklan ALTER COLUMN idiklan SET DEFAULT nextval('public.iklan_idiklan_seq'::regclass);


--
-- TOC entry 2883 (class 2604 OID 24780)
-- Name: kota idkota; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kota ALTER COLUMN idkota SET DEFAULT nextval('public.kota_idkota_seq'::regclass);


--
-- TOC entry 2882 (class 2604 OID 24769)
-- Name: provinsi idprovinsi; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinsi ALTER COLUMN idprovinsi SET DEFAULT nextval('public.provinsi_idprovinsi_seq'::regclass);


--
-- TOC entry 2880 (class 2604 OID 16451)
-- Name: user iduser; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN iduser SET DEFAULT nextval('public.user_iduser_seq'::regclass);


--
-- TOC entry 3027 (class 0 OID 16549)
-- Dependencies: 203
-- Data for Name: iklan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.iklan (idiklan, kategori, judul, luastanah, luasbangunan, kamartidur, kamarmandi, lantai, fasilitas, carport, sertifikasi, harga, gambar, deskripsi, provinsi, kota, alamat, iduser, lat, lng) FROM stdin;
2	jual	Dijual Rumah Idaman	500	200	5	3	2	AC	carport	SHM - Sertifikat Hak Milik	Rp 3.500.000.000,-	\N	Bagus	Jawa Barat	Bogor	Bogor	23	-6.595038	106.816635
3	jual	Dijual Rumah Impian	400	300	4	3	1	AC	carport	SHM - Sertifikat Hak Milik	Rp 2.500.000.000,-	\N	Bagus	Jawa Tengah	Surakarta	Surakarta	23	-7.550676	110.828316
4	sewa	Disewa Rumah Kontrakan	100	70	3	2	1	AC	carport	SHM - Sertifikat Hak Milik	Rp 25.000.000,-	\N	Disewakan per tahun	Jawa Timur	Surabaya	Surabaya	23	-7.275973	112.808304
6	option1	Dijual Rumah Sendiri	300	200	4	2	2	AC	Garasi	SHM - Sertifikat Hak Milik	Rp 3.000.000.000,-	\\x72756d6168322e6a7067	Bagus	Jawa Barat	Bekasi	Bekasi	23	-6.241586	106.99242
7	option2	Disewa Rumah Sendiri	300	200	4	3	1	Garden	Garasi	HGB - Hak Guna Bangun	Rp 20.000.000,-	\\x72756d6168332e6a7067	Disewakan per tahun	Jawa Tengah	Semarang	Semarang	23	-7.049	110.438
10	option1	Dijual Rumah Ortu	300	200	4	3	2	Garden	Carport	SHM - Sertifikat Hak Milik	Rp 3.200.000.000,-	\N	Bagus	Jawa Barat	Bandung	Bandung	23	-6.914744	107.60981
16	jual	Dijual Rumah Teman	300	200	5	3	2	AC	Carport	SHM - Sertifikat Hak Milik	Rp 4.000.000.000,-	\N	Bagus	Jawa Barat	Bogor	Bogor	23	-6.595038	106.816635
17	jual	Dijual Rumah Teman	300	200	5	3	2	Garden	Garasi	SHM - Sertifikat Hak Milik	Rp 3.000.000.000,-	\N	Bagus	Jawa Barat	Garut	Garut	23	-7.227906	107.9087
18	jual	Disewa Rumah Orang Lain	300	200	5	3	2	Garden	Carport	SHM - Sertifikat Hak Milik	Rp 20.000.000,-	\\x72756d6168312e6a7067	Bagus	Jawa Barat	Garut	Garut	23	-7.229322	107.907524
19	jual	Dijual Rumah Sendiri	300	200	5	3	2	AC	Carport	SHM - Sertifikat Hak Milik	Rp 3.000.000.000,-	\\x72756d6168332e706e67	Bagus	Jawa Barat	Bandung	Bandung	23	-6.9301467	107.62626
20	jual	Dijual Rumah Sendiri	300	200	5	3	2	AC	Carport	SHM - Sertifikat Hak Milik	Rp 3.000.000.000,-	\\x72756d6168332e706e67	Bagus	Jawa Barat	Bandung	Bandung	23	-6.918305	107.62254
21	jual	Dijual Rumah Ortu	300	250	4	2	1	AC	Carport	SHM - Sertifikat Hak Milik	Rp 3.200.000.000,-	\\x72756d6168342e6a7067	Bagus	Jawa Barat	Bogor	Bogor	23	-6.5976887	106.805466
22	jual	Dijual Rumah Sendiri	300	200	4	3	2	AC	Carport	SHM - Sertifikat Hak Milik	Rp 3.000.000.000,-	\\x72756d6168322e6a7067	Bagus	Jawa Barat	Bogor	Bogor	23	-6.5975637	106.80616
23	jual	Dijual Rumah Sendiri	300	200	5	3	2	AC	Carport	SHM - Sertifikat Hak Milik	Rp 3.000.000.000,-	\\x72756d6168332e706e67	Bagus	Jawa Barat	Bogor	Bogor	23	-6.59752	106.806694
\.


--
-- TOC entry 3031 (class 0 OID 24777)
-- Dependencies: 207
-- Data for Name: kota; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kota (idkota, namakota, idprovinsi) FROM stdin;
\.


--
-- TOC entry 3029 (class 0 OID 24766)
-- Dependencies: 205
-- Data for Name: provinsi; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.provinsi (idprovinsi, namaprovinsi) FROM stdin;
1	Jawa Barat
2	Jawa Tengah
3	Jawa Timur
\.


--
-- TOC entry 3025 (class 0 OID 16448)
-- Dependencies: 201
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (iduser, nama, email, password, nohandphone) FROM stdin;
23	Gading	albajiligadingp313@gmail.com	$2b$10$5Gl./kYHFC/Bs0EbnRbvLeusa0VctKh/dsZxd2tb1vUnf.1GTMG.u	08111544313
\.


--
-- TOC entry 3041 (class 0 OID 0)
-- Dependencies: 202
-- Name: iklan_idiklan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.iklan_idiklan_seq', 23, true);


--
-- TOC entry 3042 (class 0 OID 0)
-- Dependencies: 206
-- Name: kota_idkota_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kota_idkota_seq', 1, false);


--
-- TOC entry 3043 (class 0 OID 0)
-- Dependencies: 204
-- Name: provinsi_idprovinsi_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.provinsi_idprovinsi_seq', 3, true);


--
-- TOC entry 3044 (class 0 OID 0)
-- Dependencies: 200
-- Name: user_iduser_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_iduser_seq', 23, true);


--
-- TOC entry 2887 (class 2606 OID 16557)
-- Name: iklan iklan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iklan
    ADD CONSTRAINT iklan_pkey PRIMARY KEY (idiklan);


--
-- TOC entry 2891 (class 2606 OID 24785)
-- Name: kota kota_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kota
    ADD CONSTRAINT kota_pkey PRIMARY KEY (idkota);


--
-- TOC entry 2889 (class 2606 OID 24774)
-- Name: provinsi provinsi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinsi
    ADD CONSTRAINT provinsi_pkey PRIMARY KEY (idprovinsi);


--
-- TOC entry 2885 (class 2606 OID 16456)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (iduser);


--
-- TOC entry 2893 (class 2606 OID 24786)
-- Name: kota id_provinsi; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kota
    ADD CONSTRAINT id_provinsi FOREIGN KEY (idprovinsi) REFERENCES public.provinsi(idprovinsi);


--
-- TOC entry 2892 (class 2606 OID 16558)
-- Name: iklan id_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iklan
    ADD CONSTRAINT id_user FOREIGN KEY (iduser) REFERENCES public."user"(iduser) NOT VALID;


-- Completed on 2020-12-09 16:09:52 WIB

--
-- PostgreSQL database dump complete
--

