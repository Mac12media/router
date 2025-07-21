/**
 * Prop type for navigation
 */
type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  icon: Icon;
};

/**
 * Prop type for header
 */
type HeaderProps = {
  title: string;
  children?: React.ReactNode;
};

/**
 * Represents a general schema.
 *
 * An array of objects, each containing a key and its corresponding ValidationType.
 */
type GeneralSchema = {
  key: string;
  value: ValidationType;
  required?: boolean;
};

/**
 * Validation types
 *
 * These can be extended
 * * See instructions in @/lib/validation/index.ts
 */
type ValidationType =
  | "phone"
  | "email"
  | "string"
  | "number"
  | "date"
  | "boolean"
  | "url"
  | "zip_code";

/**
 * Row type for the main dashboard data on /dashboard route
 */
type LeadAndErrorCountResults = {
  date: string;
  leads: number;
  errors: number;
}[];

/**
 * Represents a mapping between keys of type `GeneralSchema["key"]`
 * and the return types of the corresponding validation functions
 * from the `validations` object.
 */
type SchemaToZodMap = {
  [P in GeneralSchema["key"]]: ReturnType<
    (typeof validations)[GeneralSchema["value"]]
  >;
};

/**
 * Type for fetched logs
 *
 * includes attributes of the 'endpoint' db model
 */
type LogRow = {
  id: string;
  type: "success" | "error";
  message: Record<string, any> | unknown;
  endpoint: string;
  endpointId: string;
  createdAt: Date;
};


type RecruitingTask = {
  name: string;           // Name of the task, e.g., "Follow up with student X"
  status: "In Progress" | "Completed" | "Pending";  // The status of the task
  dueDate: string;        // ISO string format date, e.g., "2025-06-10T00:00:00Z"
  completed: number;      // Number of steps completed for the task (e.g., 3 out of 5 students contacted)
  totalSteps: number;     // Total number of steps required for this task (e.g., 5 students to contact)
  category: "Outreach" | "Follow-up" | "Event Planning" | "Application Review";  // The category of the task
  assignedTo?: string;    // (Optional) The person assigned to the task (e.g., "John Doe")
};


type Task = {
  name: string;
  status: string;
  dueDate: string;  // ISO string date
  completed: number;
};

type CoachRow = {
  id: number;
  school: string;
  image: string;
  location: string;  // Added location field
  division: string;
  conference: string;  // Added conference field
  head_coach: string;
  bio: string;  // Renamed bio to program_bio to align with the field name in your structure
  email: string;
  phone: string;
  full_staff: string;  // Added full_staff field
  website: string;
  gpa: string;  // Added GPA field
  act_sat: string;  // Added ACT field
  camps: string;  // Added camps field
  expo_score: string;  // Added expo_score field

};

type CampaignRow = {
  id: string;
  userId: string;
  name: string;
  segments: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Type for fetched leads
 *
 * includes attributes of the 'endpoint' db model
 */
type LeadRow = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

/**
 * Represents a log message.
 *
 * This type can have two possible shapes:
 * - If the log message is successfully parsed, it will have a shape defined by the `SafeParseReturnType` type.
 * - If the log message is not successfully parsed, it will have a shape of `{ success: string }`.
 */
type LogMessage =
  | z.SafeParseReturnType<
      {
        [x: string]: any;
      },
      {
        [x: string]: any;
      }
    >
  | { success: string };

/**
 * Represents a function that handles server actions.
 *
 * @param formData - The form data to be processed by the server action.
 * @returns A promise that resolves to an object containing an error message, or undefined if there is no error.
 */
type ServerActionFunction = (
  formData: FormData
) => Promise<{ error: string } | undefined>;

type LogPostType = "http" | "form" | "webhook" | "email";
