import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consultation, ConsultationDocument } from '../database/schemas/consultation.schema';
import { CreateConsultationDto } from './dto/create-consultation.dto';
@Injectable() export class ConsultationsService { constructor(@InjectModel(Consultation.name) private readonly consultations: Model<ConsultationDocument>) {} create(dto: CreateConsultationDto, userId?: string) { return this.consultations.create({ ...dto, userId }); } all() { return this.consultations.find().sort({ createdAt: -1 }).limit(100); } }

