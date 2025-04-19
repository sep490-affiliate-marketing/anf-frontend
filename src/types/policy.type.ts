export interface IPolicy {
    id: number,
    header: string,
    description: string,
    createdAt: string
}

export interface IGetPolicyByIdResponse {
    isSuccess: boolean,
    message: string,
    value: IPolicy | null
}

export interface IGetPolicyByIdFailResponse {
    isSuccess: boolean,
    statusCode: number,
    message: string,
    details: string
}
export interface IGetPoliciesResponse {
    isSuccess: boolean,
    message: string,
    value: IPaginatedResponse<IPolicy> | null
}

export interface IGetPoliciesFailResponse {
    isSuccess: boolean,
    statusCode: number,
    message: string,
    details: string

}

export interface IPolicyRequest {
    header: string,
    description: string
}

export interface ICreatePolicySuccessResponse {
    isSuccess: boolean,
    message: string,
    value: IPolicy | null
}

export interface ICreatePolicyErrorResponse {
    isSuccess: boolean,
    statusCode: number,
    message: string,
    details: string
}
export interface IUpdatePolicySuccessResponse {
    isSuccess: boolean,
    message: string,
    value: IPolicy | null
}
export interface IUpdatePolicyErrorResponse {
    isSuccess: boolean,
    statusCode: number,
    message: string,
    details: string
}
export interface IDeletePolicySuccessResponse {
    isSuccess: boolean,
    message: string,
    value: IPolicy | null
}
export interface IDeletePolicyErrorResponse {
    isSuccess: boolean,
    statusCode: number,
    message: string,
    details: string
}
