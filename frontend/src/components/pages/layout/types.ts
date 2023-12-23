export interface INotification {
	message:string,
	description: string,
  type:TypeResponse
}

export interface INotificationAction {
	openNotification: (data: INotification) => void
}

export interface INavigateAction {
	navigate: (data: string) => void
}

export enum TypeResponse {
  success = 'success',
  failed = 'failed',
}

export interface IResponseFailed{
	message: string,
  statusCode: number;
}

export interface IResponseFailedAction {
	callNotification?: (data: ICallNotificationAction) => void
}

export interface ICallNotificationAction {
	type: TypeResponse,
	message: string,
	error?: string,
}

export interface IErrorResponse {
	error?: string
}
