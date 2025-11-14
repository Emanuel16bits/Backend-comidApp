import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import * as createReviewDto from './dto/create-review.dto';
import * as updateReviewDto from './dto/update-review.dto';
import * as yup from 'yup';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() body: createReviewDto.CreateReviewDto) {
    try {
      const data = await createReviewDto.createReviewSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.reviewsService.create(data);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Error',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: updateReviewDto.UpdateReviewDto,
  ) {
    try {
      const data = await updateReviewDto.updateReviewSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return this.reviewsService.update(+id, data);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Error',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
