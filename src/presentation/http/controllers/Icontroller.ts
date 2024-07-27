import RequestObject from '../../../utils/types/requestObject';

export default interface IContoller<T> {
  handle(request: RequestObject): Promise<T>;
}
