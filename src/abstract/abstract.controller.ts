import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AbstractService } from './abstract.service';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../guards/auth.guard';
import { RequestsPipe } from '../validations/requests.pipe';
import { AbstractInterface, ControllerOptions } from './abstract.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function abstract(options: ControllerOptions) {
  abstract class Abstract implements AbstractInterface {
    constructor(public service: AbstractService) {}

    @Get()
    @UseGuards(AuthGuard)
    async find(@Query('filters') filters: any): Promise<any[]> {
      return this.service.find(filters);
    }

    @Post()
    @ApiOperation(options.apiCreateSchema)
    @ApiResponse(options.apiCreateResponseSchema)
    @UseGuards(AuthGuard)
    @UsePipes(new RequestsPipe(options.createValidation))
    async create(@Body() params: any): Promise<any> {
      try {
        this.service.begin();
        const response = await this.service.create(params);
        await this.service.commit();

        return response;
      } catch (error) {
        await this.service.rollback();
      }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findById(@Param('id') id: string | ObjectId): Promise<any> {
      return this.service.findById(id);
    }

    @Put(':id')
    @ApiOperation(options.apiUpdateSchema)
    @ApiResponse(options.apiUpdateResponseSchema)
    @UseGuards(AuthGuard)
    @UsePipes(new RequestsPipe(options.updateValidation))
    async update(
      @Param('id') id: string | ObjectId,
      @Body() params: any,
    ): Promise<any> {
      try {
        this.service.begin();
        const response = await this.service.update(id, params);
        await this.service.commit();

        return response;
      } catch (error) {
        await this.service.rollback();
      }
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string | ObjectId): Promise<any> {
      try {
        this.service.begin();
        const response = this.service.delete(id);
        await this.service.commit();

        return response;
      } catch (error) {
        await this.service.rollback();
      }
    }
  }

  return Abstract;
}

// export abstract class AbstractController {
//   protected createValidation: Joi.ObjectSchema<any>;
//   protected updateValidation: Joi.ObjectSchema<any>;

//   constructor(protected service: AbstractService) {}

//   @Get()
//   @UseGuards(AuthGuard)
//   async find(@Query('filters') filters: any): Promise<any[]> {
//     return this.service.find(filters);
//   }

//   @Get(':id')
//   @UseGuards(AuthGuard)
//   async findById(@Param('id') id: string | ObjectId): Promise<any> {
//     return this.service.findById(id);
//   }

//   @Post()
//   @UseGuards(AuthGuard)
//   async create(@Body() params: any): Promise<any> {
//     new RequestsPipe(this.createValidation).transform(params, null);

//     try {
//       this.service.begin();
//       const response = await this.service.create(params);
//       await this.service.commit();

//       return response;
//     } catch (error) {
//       await this.service.rollback();
//     }
//   }

//   @Put(':id')
//   @UseGuards(AuthGuard)
//   async update(
//     @Param('id') id: string | ObjectId,
//     @Body() params: any,
//   ): Promise<any> {
//     new RequestsPipe(this.updateValidation).transform(params, null);

//     try {
//       this.service.begin();
//       const response = await this.service.update(id, params);
//       await this.service.commit();

//       return response;
//     } catch (error) {
//       await this.service.rollback();
//     }
//   }

//   @Delete(':id')
//   @UseGuards(AuthGuard)
//   async delete(@Param('id') id: string | ObjectId): Promise<any> {
//     try {
//       this.service.begin();
//       const response = this.service.delete(id);
//       await this.service.commit();

//       return response;
//     } catch (error) {
//       await this.service.rollback();
//     }
//   }
// }
