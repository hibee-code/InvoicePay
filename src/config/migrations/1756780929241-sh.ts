import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1756780929241 implements MigrationInterface {
    name = 'Sh1756780929241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "withdrawal_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "businessId" character varying NOT NULL, "amount" double precision NOT NULL, "bankDetails" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bc9a9e96931501edf31e665327f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_transaction_type_enum" AS ENUM('credit', 'debit')`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_transaction_status_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`CREATE TABLE "wallet_transaction" ("id" BIGSERIAL NOT NULL, "walletId" bigint NOT NULL, "amount" numeric(15,2) NOT NULL, "type" "public"."wallet_transaction_type_enum" NOT NULL, "ref" character varying(100) NOT NULL, "status" "public"."wallet_transaction_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_05830d686ef5eed40d7650e6ca5" UNIQUE ("ref"), CONSTRAINT "PK_62a01b9c3a734b96a08c621b371" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."invoice_status_enum" AS ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled')`);
        await queryRunner.query(`CREATE TABLE "invoice" ("id" BIGSERIAL NOT NULL, "businessId" bigint NOT NULL, "amount" numeric NOT NULL, "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."invoice_status_enum" NOT NULL DEFAULT 'Draft', "recipientEmail" character varying, "pdfUrl" character varying(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "virtual_account" ("id" BIGSERIAL NOT NULL, "businessId" bigint NOT NULL, "accountNumber" character varying NOT NULL, "bankName" character varying NOT NULL, "providerRef" character varying(100), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_99fe832b729025bba1ec2431d56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_log" ("id" BIGSERIAL NOT NULL, "userId" bigint NOT NULL, "action" character varying(100) NOT NULL, "details" json, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" BIGSERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying(20) NOT NULL, "password" character varying NOT NULL, "isEmailVerified" boolean NOT NULL DEFAULT false, "isPhoneVerified" boolean NOT NULL DEFAULT false, "otp" character varying, "otpExpiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."business_kycstatus_enum" AS ENUM('pending', 'approved', 'rejected', 'suspended', 'active')`);
        await queryRunner.query(`CREATE TABLE "business" ("id" BIGSERIAL NOT NULL, "businessName" character varying NOT NULL, "rcNumber" character varying(50) NOT NULL, "vbaAccountNumber" character varying(20) NOT NULL, "kycStatus" "public"."business_kycstatus_enum" NOT NULL DEFAULT 'pending', "userId" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" bigint, CONSTRAINT "UQ_b485ad884cd5182b8ba80f03316" UNIQUE ("businessName"), CONSTRAINT "UQ_11f79731c7d92a61b0b820639bb" UNIQUE ("rcNumber"), CONSTRAINT "UQ_592dfa1c389377e9d1694457091" UNIQUE ("vbaAccountNumber"), CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" BIGSERIAL NOT NULL, "businessId" bigint NOT NULL, "balance" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" ADD CONSTRAINT "FK_07de5136ba8e92bb97d45b9a7af" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_0f9fd8394924b31d1ae81f75f5f" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "virtual_account" ADD CONSTRAINT "FK_760d7b081d1cc575ffca3abc0df" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_2621409ebc295c5da7ff3e41396" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business" ADD CONSTRAINT "FK_91230ea862c52e2aa78208c7bb8" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_91230ea862c52e2aa78208c7bb8"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_2621409ebc295c5da7ff3e41396"`);
        await queryRunner.query(`ALTER TABLE "virtual_account" DROP CONSTRAINT "FK_760d7b081d1cc575ffca3abc0df"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_0f9fd8394924b31d1ae81f75f5f"`);
        await queryRunner.query(`ALTER TABLE "wallet_transaction" DROP CONSTRAINT "FK_07de5136ba8e92bb97d45b9a7af"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TABLE "business"`);
        await queryRunner.query(`DROP TYPE "public"."business_kycstatus_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
        await queryRunner.query(`DROP TABLE "virtual_account"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TYPE "public"."invoice_status_enum"`);
        await queryRunner.query(`DROP TABLE "wallet_transaction"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transaction_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "withdrawal_request"`);
    }

}
