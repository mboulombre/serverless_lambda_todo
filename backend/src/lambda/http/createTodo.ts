import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { buildToDo } from '../../helpers/todos'
import { createTodo } from '../../helpers/todosAcess'
// import { getUserId } from '../utils';
// import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    if(newTodo.name){
        const todo = buildToDo(newTodo, event);
        const todoCreated = await createTodo(todo);
    
        return { 
          statusCode: 201,
          headers: { 
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-credentials' : true,
         },
          body: JSON.stringify({
            item: todoCreated
          })
        }
      }

    
  }
)

handler.use(
  cors({
    credentials: true
  })
)
