export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface ActionState {
  error?: string;
  message?: string;
}
