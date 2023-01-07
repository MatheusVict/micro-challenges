import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class AllRpcException implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    /* console.log(
      '🚀 ~ file: Rpc-Execptionfilters.ts:8 ~ AllRpcException ~ exception',
      exception,
    );
    const rpcMethods = host.switchToRpc();

    const context = rpcMethods.getContext();
    console.log(
      '🚀 ~ file: Rpc-Execptionfilters.ts:11 ~ AllRpcException ~ context',
      context,
    );
    const data = rpcMethods.getData();
    console.log(
      '🚀 ~ file: Rpc-Execptionfilters.ts:13 ~ AllRpcException ~ data',
      data,
    );
    const getError = exception.getError();
    console.log(
      '🚀 ~ file: Rpc-Execptionfilters.ts:25 ~ AllRpcException ~ getError',
      getError,
    );
    const msg = exception.initMessage();
    console.log(
      '🚀 ~ file: Rpc-Execptionfilters.ts:27 ~ AllRpcException ~ msg',
      msg,
    );
    const mensagem = exception.message;
    console.log(
      '🚀 ~ file: Rpc-Execptionfilters.ts:29 ~ AllRpcException ~ mensagem',
      mensagem,
    );
    const ola = exception.name;
    console.log(
      '🚀 ~ file: Rpc-Execptionfilters.ts:31 ~ AllRpcException ~ ola',
      ola,
    );
    const stack = exception.stack;
    console.log(
      '🚀 ~ file: Rpc-Execptionfilters.ts:33 ~ AllRpcException ~ stack',
      stack,
    );*/
    return throwError(() => exception.getError());
  }
}
