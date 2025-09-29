import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import OuterLayout from "../layouts/OuterLayout.vue";
import MainLayout from "../layouts/MainLayout2.vue";
import Register from "../views/Auth/Register.vue";
import Login from "../views/Auth/Login.vue";
import ResetPassword from "../views/Auth/ResetPassword.vue";
import Dashboard from "../views/Pages/Dashboard.vue";
import EmployeeDashboard from "../views/Pages/EmployeeDashboard.vue";
import Profile from "../views/Pages/Profile.vue";
import RegisterSuccess from "../views/Auth/RegisterSuccess.vue";
import UserType from "../views/Pages/UserType.vue";
import AccountVerification from "../views/Pages/AccountVerification.vue";
import Users from "../views/Pages/Users.vue";
import UserModules from "../views/Pages/UserModules.vue";
import ModulesList from "../views/Pages/ModulesList.vue";
import NotFound from "../views/Pages/NotFound.vue";
import Patient from "../views/Pages/Patient.vue"
import Inventory from "../views/Pages/Inventory.vue"
import Appointment from "../views/Pages/Appointment.vue"
import HospitalBilling from "../views/Pages/HospitalBilling.vue"
import LaboratoryRequest from "../views/Pages/LaboratoryRequest.vue"
import BillingData from "../views/Pages/BillingData.vue"
import ReuestData from "../views/Pages/RequestData.vue"
import PatientAppointment from "../views/Auth/PatientAppointment.vue"
import LandingPage from "../views/Auth/LandingPage.vue"
import Services from "../views/Pages/Services.vue"
import PatientDoctor from "../views/Pages/PatientDoctor.vue"
import PatientEntry from "../views/Auth/PatientEntry.vue";
import DoctorsUtility from "../views/Pages/DoctorsUtility.vue";
import MedicalInformation from "../views/Pages/MedicalInformation.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: OuterLayout,
    redirect: "/landing-page",
    meta: { authRequired: false },
    children: [
      {
        path: "landing-page",
        // alias: "/landing-page",
        component: LandingPage,
        meta: { authRequired: false },
      },
      {
        path: "login",
        // alias: "/login",
        component: Login,
        meta: { authRequired: false },
      },
     
      {
        path: "register",
        component: Register,
        meta: { authRequired: false },
      },
      {
        path: "registration-success",
        component: RegisterSuccess,
        meta: { authRequired: false },
      },
         {
        path: "patient-appointment",
        component: PatientAppointment,
        meta: { authRequired: false },
      },

            {
        path: "patient-entry",
        component: PatientEntry,
        meta: { authRequired: false },
      },
 
      {
        path: "forgot-pw",
        component: ResetPassword,
        meta: { authRequired: false },
      },
  
    ],
  },
  {
    path: "*",
    component: NotFound,
    meta: { authRequired: false },
  },
  //admin
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    meta: { RouteForAdmin: true, authRequired: true },
    component: MainLayout,
    children: [
      {
        path: "dashboard",
        component: Dashboard,
        meta: { title: "Dashboard", authRequired: true },
      },

      {
        path: "acc_verify",
        component: AccountVerification,
        meta: { title: "Account Verification", authRequired: true },
      },

      {
        path: "user-type",
        component: UserType,
        meta: { title: "Utilities - Type of Users", authRequired: true },
      },
      {
        path: "profile",
        component: Profile,
        meta: { title: "My Profile", authRequired: true },
      },
  
      {
        path: "modules-list",
        component: ModulesList,
        meta: { title: "List of Modules", authRequired: true },
      },

      {
        path: "user-modules",
        component: UserModules,
        meta: { title: "User Modules", authRequired: true },
      },

      {
        path: "users",
        component: Users,
        meta: { title: "Utilities - Users", authRequired: true },
      },
      {
        path: "patient",
        component: Patient,
        meta: { title: "Patient Table", authRequired: true },
      },
      {
        path: "inventory",
        component: Inventory,
        meta: { title: "Inventory Table", authRequired: true },
      },
      {
        path: "appointment",
        component: Appointment,
        meta: { title: "Appointment Table", authRequired: true },
      },
      {
        path: "billing",
        component: HospitalBilling,
        meta: { title: "Hospital Billing", authRequired: true },
      },
      {
        path: "request",
        component: LaboratoryRequest,
        meta: { title: "Laboratory & Imaging Request", authRequired: true },
      },
      {
        path: "billing-data",
        component: BillingData,
        meta: { title: "Billing Data Table", authRequired: true },
      },
      {
        path: "request-data",
        component: ReuestData,
        meta: { title: "Request Data Table", authRequired: true },
      },
       {
        path: "services",
        component: Services,
        meta: { title: "Services", authRequired: true },
      },

      // {
      //   path: "404",
      //   component: NotFound,
      //   meta: { authRequired: true },
      // },
    ],
  },
  //superadmin]
  {
    path: "/superadmin",
    redirect: "/superadmin/dashboard",
    meta: { RouteForSuperAdmin: true, authRequired: true },
    component: MainLayout,
    children: [
      {
        path: "dashboard",
        component: Dashboard,
        meta: { title: "Dashboard", authRequired: true },
      },



      {
        path: "user-type",
        component: UserType,
        meta: { title: "Utilities - Type of Users", authRequired: true },
      },
      {
        path: "profile",
        component: Profile,
        meta: { title: "My Profile", authRequired: true },
      },
      {
        path: "user-modules",
        component: UserModules,
        meta: { title: "User Modules", authRequired: true },
      },
      {
        path: "modules-list",
        component: ModulesList,
        meta: { title: "List of Modules", authRequired: true },
      },
      {
        path: "acc_verify",
        component: AccountVerification,
        meta: { title: "Account Verification", authRequired: true },
      },

      {
        path: "users",
        component: Users,
        meta: { title: "Utilities - Users", authRequired: true },
      },
      {
        path: "patient",
        component: Patient,
        meta: { title: "Patient Table", authRequired: true },
      },
      {
        path: "inventory",
        component: Inventory,
        meta: { title: "Inventory Table", authRequired: true },
      },
      {
        path: "appointment",
        component: Appointment,
        meta: { title: "Appointment Table", authRequired: true },
      },
      {
        path: "billing",
        component: HospitalBilling,
        meta: { title: "Hospital Billing", authRequired: true },
      },
      {
        path: "request",
        component: LaboratoryRequest,
        meta: { title: "Laboratory & Imaging Request", authRequired: true },
      },
      {
        path: "billing-data",
        component: BillingData,
        meta: { title: "Billing Data Table", authRequired: true },
      },
      {
        path: "request-data",
        component: ReuestData,
        meta: { title: "Request Data Table", authRequired: true },
      },
   

      



    ],
  },
  //employee
  {
    path: "/employee",
    meta: { RouteForEmployee: true, authRequired: true },
    component: MainLayout,
    children: [
      {
        path: "/employee",
        alias: "/employee/dashboard",
        component: EmployeeDashboard,
        meta: { title: "Dashboard", authRequired: true },
      },
      {
        path: "profile",
        component: Profile,
        meta: { title: "My Profile", authRequired: true },
      },

      {
        path: "patient",
        component: Patient,
        meta: { title: "Patient Table", authRequired: true },
      },
      {
        path: "inventory",
        component: Inventory,
        meta: { title: "Inventory Table", authRequired: true },
      },

      {
        path: "billing",
        component: HospitalBilling,
        meta: { title: "Hospital Billing", authRequired: true },
      },

      {
        path: "billing-data",
        component: BillingData,
        meta: { title: "Billing Data Table", authRequired: true },
      },
      {
        path: "request-data",
        component: ReuestData,
        meta: { title: "Request Data Table", authRequired: true },
      },
      {
        path: "services",
        component: Services,
        meta: { title: "Services", authRequired: true },
      },

       {
        path: "patient-doctor",
        component: PatientDoctor,
        meta: { title: "Patient Doctor List", authRequired: true },
      },
      
      {
        path: "doctors-utility",
        component: DoctorsUtility,
        meta: { title: "Doctors Utility", authRequired: true },
      },

      {
        path: "medical-information",
        component: MedicalInformation,
        meta: { title: "Medical Information", authRequired: true },
      },

      {
        path: "request",
        component: LaboratoryRequest,
        meta: { title: "Laboratory & Imaging Request", authRequired: true },
      },

      {
        path: "appointment",
        component: Appointment,
        meta: { title: "Appointment Table", authRequired: true },
      },

    ],
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // let user = store.state.user;
  const isAuthenticated = store.getters.getIsAuthenticated;
  // // console.log(to);
  if (to.matched.some((record) => record.meta.authRequired == true)) {
    if (isAuthenticated) {
      let pt = to.fullPath;
      let ptSplit = pt.split("/");

      if (store.state.user.user.usertypeID == 1) {
        if (ptSplit[1].toLowerCase() == "admin") {
          if (!to.matched.length) {
            next("/admin/dashboard");
          } else {
            next();
          }
        } else {
          next("/admin/dashboard");
        }
      }  else {
        if (store.state.user.user.user_roleID == 5) {
          if (ptSplit[1].toLowerCase() == "superadmin") {
            if (!to.matched.length) {
              next("/superadmin/dashboard");
            } else {
              next();
            }
          } else {
            next("/superadmin/dashboard");
          }
        } else {
          if (ptSplit[1].toLowerCase() == "employee") {
            if (!to.matched.length) {
              next("/employee/dashboard");
            } else {
              next();
            }
          } else {
            next("/employee/dashboard");
          }
        }
      }
    } else {
      next("/");
    }
  } else {
    if (isAuthenticated) {
      let pt = to.fullPath;
      let ptSplit = pt.split("/");

      if (store.state.user.user.usertypeID == 1) {
        if (ptSplit[1].toLowerCase() == "admin") {
          if (!to.matched.length) {
            next("/admin/dashboard");
          } else {
            next();
          }
        } else {
          next("/admin/dashboard");
        }
      } else {
        if (store.state.user.user.user_roleID == 5) {
          if (ptSplit[1].toLowerCase() == "superadmin") {
            if (!to.matched.length) {
              next("/superadmin/dashboard");
            } else {
              next();
            }
          } else {
            next("/superadmin/dashboard");
          }
        } else {
          if (ptSplit[1].toLowerCase() == "employee") {
            if (!to.matched.length) {
              next("/employee/dashboard");
            } else {
              next();
            }
          } else {
            next("/employee/dashboard");
          }
        }
      }
    } else {
      next();
    }
  }

});

export default router;
