export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activities: {
        Row: {
          angelnftid: string | null
          createdat: string | null
          id: string
          reward: number
          type: string
          userid: string | null
        }
        Insert: {
          angelnftid?: string | null
          createdat?: string | null
          id: string
          reward: number
          type: string
          userid?: string | null
        }
        Update: {
          angelnftid?: string | null
          createdat?: string | null
          id?: string
          reward?: number
          type?: string
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_angelnftid_fkey"
            columns: ["angelnftid"]
            isOneToOne: false
            referencedRelation: "angelnfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
        ]
      }
      angelnfts: {
        Row: {
          angellevel: number
          badgelevel: string | null
          createdat: string | null
          governancestatus: Json
          id: string
          proposalrights: string[] | null
          rewards: Json
          status: string | null
          tokenid: number
          updatedat: string | null
          votingpower: number | null
          walletaddress: string | null
        }
        Insert: {
          angellevel: number
          badgelevel?: string | null
          createdat?: string | null
          governancestatus?: Json
          id: string
          proposalrights?: string[] | null
          rewards?: Json
          status?: string | null
          tokenid: number
          updatedat?: string | null
          votingpower?: number | null
          walletaddress?: string | null
        }
        Update: {
          angellevel?: number
          badgelevel?: string | null
          createdat?: string | null
          governancestatus?: Json
          id?: string
          proposalrights?: string[] | null
          rewards?: Json
          status?: string | null
          tokenid?: number
          updatedat?: string | null
          votingpower?: number | null
          walletaddress?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "angelnfts_walletaddress_fkey"
            columns: ["walletaddress"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "angelnfts_walletaddress_fkey"
            columns: ["walletaddress"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
        ]
      }
      areaperformances: {
        Row: {
          createdat: string | null
          downlinecount: number | null
          downlinerank: string | null
          id: number
          opsvolume: number
          placementarea: string | null
          updatedat: string | null
          userid: string | null
        }
        Insert: {
          createdat?: string | null
          downlinecount?: number | null
          downlinerank?: string | null
          id?: number
          opsvolume?: number
          placementarea?: string | null
          updatedat?: string | null
          userid?: string | null
        }
        Update: {
          createdat?: string | null
          downlinecount?: number | null
          downlinerank?: string | null
          id?: number
          opsvolume?: number
          placementarea?: string | null
          updatedat?: string | null
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "areaperformances_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "areaperformances_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
        ]
      }
      opspresale: {
        Row: {
          createdat: string | null
          cycleid: number
          groupid: number
          id: number
          minprice: number
          stages: number
          totalamount: number
        }
        Insert: {
          createdat?: string | null
          cycleid: number
          groupid: number
          id?: number
          minprice: number
          stages: number
          totalamount: number
        }
        Update: {
          createdat?: string | null
          cycleid?: number
          groupid?: number
          id?: number
          minprice?: number
          stages?: number
          totalamount?: number
        }
        Relationships: []
      }
      opspresaleprogress: {
        Row: {
          cycleid: number
          id: number
          totalopsamount: number
          updatedat: string | null
        }
        Insert: {
          cycleid: number
          id?: number
          totalopsamount?: number
          updatedat?: string | null
        }
        Update: {
          cycleid?: number
          id?: number
          totalopsamount?: number
          updatedat?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          createdat: string | null
          creator: string | null
          description: string
          id: string
          status: string | null
          title: string
          updatedat: string | null
          votesagainst: number | null
          votesfor: number | null
        }
        Insert: {
          createdat?: string | null
          creator?: string | null
          description: string
          id: string
          status?: string | null
          title: string
          updatedat?: string | null
          votesagainst?: number | null
          votesfor?: number | null
        }
        Update: {
          createdat?: string | null
          creator?: string | null
          description?: string
          id?: string
          status?: string | null
          title?: string
          updatedat?: string | null
          votesagainst?: number | null
          votesfor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
        ]
      }
      starnftconfig: {
        Row: {
          airdroprate: number
          benefits: string[]
          contractvalue: number
          createdat: string | null
          generation1reward: number | null
          generation2reward: number | null
          generation3reward: number | null
          id: number
          maxtiers: number
          name: string
          opebuyback: number
          opsPresale: number
          opsPresaleAmount: number | null
          price: number | null
          tokenid: number
        }
        Insert: {
          airdroprate: number
          benefits: string[]
          contractvalue: number
          createdat?: string | null
          generation1reward?: number | null
          generation2reward?: number | null
          generation3reward?: number | null
          id?: number
          maxtiers: number
          name: string
          opebuyback: number
          opsPresale: number
          opsPresaleAmount?: number | null
          price?: number | null
          tokenid: number
        }
        Update: {
          airdroprate?: number
          benefits?: string[]
          contractvalue?: number
          createdat?: string | null
          generation1reward?: number | null
          generation2reward?: number | null
          generation3reward?: number | null
          id?: number
          maxtiers?: number
          name?: string
          opebuyback?: number
          opsPresale?: number
          opsPresaleAmount?: number | null
          price?: number | null
          tokenid?: number
        }
        Relationships: []
      }
      starnfts: {
        Row: {
          activationtime: string | null
          badgelevel: string | null
          contractvalue: string
          createdat: string | null
          currentvalue: string
          id: string
          releaserate: string
          starlevel: number
          status: string | null
          tokenid: number
          totalopsairdropped: string
          totalopsbought: string
          totalopsrewarded: string
          totalreleased: string
          updatedat: string | null
          usdvaluecap: string
          walletaddress: string | null
        }
        Insert: {
          activationtime?: string | null
          badgelevel?: string | null
          contractvalue: string
          createdat?: string | null
          currentvalue: string
          id: string
          releaserate: string
          starlevel: number
          status?: string | null
          tokenid: number
          totalopsairdropped: string
          totalopsbought: string
          totalopsrewarded: string
          totalreleased: string
          updatedat?: string | null
          usdvaluecap: string
          walletaddress?: string | null
        }
        Update: {
          activationtime?: string | null
          badgelevel?: string | null
          contractvalue?: string
          createdat?: string | null
          currentvalue?: string
          id?: string
          releaserate?: string
          starlevel?: number
          status?: string | null
          tokenid?: number
          totalopsairdropped?: string
          totalopsbought?: string
          totalopsrewarded?: string
          totalreleased?: string
          updatedat?: string | null
          usdvaluecap?: string
          walletaddress?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "starnfts_walletaddress_fkey"
            columns: ["walletaddress"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "starnfts_walletaddress_fkey"
            columns: ["walletaddress"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
        ]
      }
      userpurchasedstarnft: {
        Row: {
          id: number
          purchasedat: string | null
          starnftid: number
          userid: number
        }
        Insert: {
          id?: number
          purchasedat?: string | null
          starnftid: number
          userid: number
        }
        Update: {
          id?: number
          purchasedat?: string | null
          starnftid?: number
          userid?: number
        }
        Relationships: []
      }
      userrelations: {
        Row: {
          createdat: string | null
          id: string
          level: number
          placementarea: string | null
          relateduserid: string | null
          type: string | null
          userid: string | null
        }
        Insert: {
          createdat?: string | null
          id: string
          level: number
          placementarea?: string | null
          relateduserid?: string | null
          type?: string | null
          userid?: string | null
        }
        Update: {
          createdat?: string | null
          id?: string
          level?: number
          placementarea?: string | null
          relateduserid?: string | null
          type?: string | null
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "userrelations_relateduserid_fkey"
            columns: ["relateduserid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userrelations_relateduserid_fkey"
            columns: ["relateduserid"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
          {
            foreignKeyName: "userrelations_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userrelations_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
        ]
      }
      users: {
        Row: {
          createdat: string | null
          email: string | null
          id: string
          nickname: string
          referralcode: string
          referrercode: string | null
          status: string | null
          updatedat: string | null
          walletaddress: string | null
        }
        Insert: {
          createdat?: string | null
          email?: string | null
          id: string
          nickname: string
          referralcode: string
          referrercode?: string | null
          status?: string | null
          updatedat?: string | null
          walletaddress?: string | null
        }
        Update: {
          createdat?: string | null
          email?: string | null
          id?: string
          nickname?: string
          referralcode?: string
          referrercode?: string | null
          status?: string | null
          updatedat?: string | null
          walletaddress?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          choice: string | null
          createdat: string | null
          id: string
          power: number
          proposalid: string | null
          voter: string | null
        }
        Insert: {
          choice?: string | null
          createdat?: string | null
          id: string
          power: number
          proposalid?: string | null
          voter?: string | null
        }
        Update: {
          choice?: string | null
          createdat?: string | null
          id?: string
          power?: number
          proposalid?: string | null
          voter?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_proposalid_fkey"
            columns: ["proposalid"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voter_fkey"
            columns: ["voter"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voter_fkey"
            columns: ["voter"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
        ]
      }
    }
    Views: {
      currentopspresaleprogress: {
        Row: {
          cycleid: number | null
          cycletarget: number | null
          progresspercentage: number | null
          totalopsamount: number | null
          updatedat: string | null
        }
        Relationships: []
      }
      viewangelnftstats: {
        Row: {
          angellevel: number | null
          nickname: string | null
          opereward: string | null
          proposalscreated: number | null
          totalproposals: string | null
          totalreleased: string | null
          totalvotes: string | null
          votesparticipated: number | null
          votingpower: number | null
          walletaddress: string | null
        }
        Relationships: [
          {
            foreignKeyName: "angelnfts_walletaddress_fkey"
            columns: ["walletaddress"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "angelnfts_walletaddress_fkey"
            columns: ["walletaddress"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
        ]
      }
      viewareaperformance: {
        Row: {
          downlinecount: number | null
          downlinerank: string | null
          nickname: string | null
          opsvolume: number | null
          placementarea: string | null
          starnftcount: number | null
          teamcount: number | null
          userid: string | null
        }
        Relationships: [
          {
            foreignKeyName: "areaperformances_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "areaperformances_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "viewuserperformance"
            referencedColumns: ["userid"]
          },
        ]
      }
      viewreferraltree: {
        Row: {
          badgelevel: string | null
          depth: number | null
          downlinecount: number | null
          downlinerank: string | null
          level: number | null
          nickname: string | null
          opsvolume: number | null
          path: string[] | null
          placementarea: string | null
          referrerid: string | null
          status: string | null
          totalproposals: string | null
          totalvotes: string | null
          userid: string | null
          votingpower: number | null
        }
        Relationships: []
      }
      viewuserperformance: {
        Row: {
          angelnftcount: number | null
          directreferrals: number | null
          nickname: string | null
          starnftcount: number | null
          teamsize: number | null
          totalvolume: number | null
          userid: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculatepurchasedopsamount: {
        Args: {
          starnftid: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
