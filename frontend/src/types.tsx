export type CaptionType = {
    start_time: number;
    end_time: number;
    text: string;
};

export type UserType = {
    email: string;
    organization: string;
};

export type SearchResultsType = {
    id: string;
    filename: string;
    task_id?: string;
    status: "PROGRESS" | "SUCCESS" | "PENDING" | "FAILURE";
    progress?: number;
};
