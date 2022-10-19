// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'
// import * as createError from 'http-errors'

// // TODO: Implement businessLogic
export  function buildToDo (todoRequest: CreateTodoRequest, event: APIGatewayProxyEvent ): TodoItem {
    const todo = {
        todoId: uuid.v4(),
        createdAt: new Date().toDateString(),
        userId: getUserId(event),
        done: false,
        attachmentUrl: '',
        ...todoRequest
    }
    return todo as TodoItem

}