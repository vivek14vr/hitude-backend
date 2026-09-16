import { Module } from '@nestjs/common';
import { PrescriptionVerificationController } from './prescription-verification.controller';
import { PrescriptionVerificationService } from './prescription-verification.service';
@Module({ controllers: [PrescriptionVerificationController], providers: [PrescriptionVerificationService] }) export class PrescriptionVerificationModule {}

