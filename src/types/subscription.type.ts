export interface ISubscription {
    id: number;
    name?: string;
    description?: string;
    price: number;
    duration?: string;
}

export interface ISubscriptionRequest {
    name?: string;
    description?: string;
    price: number;
    duration?: string;
}

export interface IGetSubscriptionByIdResponse {
    isSuccess: boolean;
    message: string;
    value: ISubscription | null;
}

export interface IGetSubscriptionByIdFailResponse {
    isSuccess: boolean;
    statusCode: number;
    message: string;
    details: string;
}

export interface IGetSubscriptionsResponse {
    isSuccess: boolean;
    message: string;
    value: IPaginatedResponse<ISubscription>;
}

export interface IGetSubscriptionFailResponse {
    isSuccess: boolean;
    statusCode: number;
    message: string;
    details: string;
}

export interface ICreateSubscriptionSuccessResponse {
    isSuccess: boolean;
    message: string;
    value: ISubscription | null;
}

export interface ICreateSubscriptionErrorResponse {
    isSuccess: boolean;
    statusCode: number;
    message: string;
    details: string;
}