import { NoticeType } from 'antd/es/message/interface'

export interface INotification {
	message:string,
	description: string,
  type:NoticeType
}

export interface INotificationAction {
	openNotification?: (data: INotification) => void
}

export interface INavigateAction {
	navigate?: (data: string) => void
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
	type: NoticeType,
	message: string,
	error?: string,
}

export interface IErrorResponse {
	error?: string
}
