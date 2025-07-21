import { V } from "@angular/cdk/keycodes"

const backendUrl= 'http://localhost:8080/api/demo1' //api/demo1/applications
export const envirement = {
    applicationService: `${backendUrl}/applications`,
    featureService: `${backendUrl}/features`,
    feedbackService: `${backendUrl}/feedbacks`,
    ticketService: `${backendUrl}/tickets`,
    UserService: `${backendUrl}/users`
}