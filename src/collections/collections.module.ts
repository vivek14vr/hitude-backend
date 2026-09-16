import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
@Controller('collections') class CollectionsController { @Get() all() { return { items: [], message: 'Collections are managed in the admin CMS.' }; } }
@Module({ controllers: [CollectionsController] }) export class CollectionsModule {}

