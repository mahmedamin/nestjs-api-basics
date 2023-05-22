import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';

interface IResponse {
  message: string[] | object;
  statusCode: number;
  error: string;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const ctxResponse = ctx.getResponse<Response>();

    const response = exception.getResponse() as IResponse;

    if (response.message) {
      response.message = (<string[]>response.message).reduce((acc, value) => {
        const key = value.split(' ')[0];
        acc[key] ? acc[key].push(value) : (acc[key] = [value]);
        return acc;
      }, {});
    }

    ctxResponse.status(400).json(response);
  }
}
