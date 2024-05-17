package com.jvpars.selection;

/*Any chnage to ths file by anyone will respond very hard. Fucking is coming :)*/
public enum LogType {
    DELETE {
        public String toString() {
            return "DELETE";
        }
    },
    CREATE {
        public String toString() {
            return "CREATE";
        }
    },
    LOGIN{
        public String toString() {
            return "LOGIN";
        }
    },
    CREATE_CONTENT {
        public String toString() {
            return "CREATE_CONTENT";
        }
    },
    UPDATE_CONTENT{
        public String toString() {
            return "UPDATE_CONTENT";
        }
    },
    PUBLISH_CONTENT{
        public String toString() {
            return "PUBLISH_CONTENT";
        }
    },
    DELETE_CONTENT {
        public String toString() {
            return "DELETE_CONTENT";
        }
    },
}
