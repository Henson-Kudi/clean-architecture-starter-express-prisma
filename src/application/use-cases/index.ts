// Manage your use cases in this folder
// Manage your use cases in this folder
export default interface IUseCase<Input extends unknown[], Output> {
  execute(...params: Input): Promise<Output>;
}
