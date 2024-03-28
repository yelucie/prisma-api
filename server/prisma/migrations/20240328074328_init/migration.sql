-- CreateTable
CREATE TABLE "author" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstname" STRING(255),
    "lastname" STRING(255),
    "country" STRING(255),

    CONSTRAINT "author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" STRING(255) NOT NULL,
    "description" STRING(255),

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_author" (
    "book_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,

    CONSTRAINT "book_author_pk" PRIMARY KEY ("book_id","author_id")
);

-- CreateTable
CREATE TABLE "book_genre" (
    "book_id" UUID NOT NULL,
    "genre_id" UUID NOT NULL,

    CONSTRAINT "book_genre_pk" PRIMARY KEY ("book_id","genre_id")
);

-- CreateTable
CREATE TABLE "genre" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" STRING(255),

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "book_author" ADD CONSTRAINT "book_author_author_fk" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_author" ADD CONSTRAINT "book_author_book_fk" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_genre" ADD CONSTRAINT "book_genre_book_fk" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_genre" ADD CONSTRAINT "book_genre_genre_fk" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
