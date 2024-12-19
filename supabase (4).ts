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
      opscycleconfig: {
        Row: {
          cycleid: number
          groupid: number
          maxprice: number | null
          minprice: number
          stagepriceincrease: number | null
          stages: number
          totalamount: number
        }
        Insert: {
          cycleid?: number
          groupid: number
          maxprice?: number | null
          minprice: number
          stagepriceincrease?: number | null
          stages: number
          totalamount: number
        }
        Update: {
          cycleid?: number
          groupid?: number
          maxprice?: number | null
          minprice?: number
          stagepriceincrease?: number | null
          stages?: number
          totalamount?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_group"
            columns: ["groupid"]
            isOneToOne: false
            referencedRelation: "opscyclegroup"
            referencedColumns: ["groupid"]
          },
        ]
      }
      opscyclegroup: {
        Row: {
          baseprice: number
          cyclesingroup: number
          groupid: number
          priceincreasemultiplier: number
        }
        Insert: {
          baseprice: number
          cyclesingroup: number
          groupid?: number
          priceincreasemultiplier: number
        }
        Update: {
          baseprice?: number
          cyclesingroup?: number
          groupid?: number
          priceincreasemultiplier?: number
        }
        Relationships: []
      }
      opsprogress: {
        Row: {
          cycleid: number
          id: number
          remainingtokens: number
          stage: number
          stageprice: number
          tokensperstage: number
          totaltokenssold: number | null
          updatedat: string | null
        }
        Insert: {
          cycleid: number
          id?: number
          remainingtokens: number
          stage: number
          stageprice: number
          tokensperstage: number
          totaltokenssold?: number | null
          updatedat?: string | null
        }
        Update: {
          cycleid?: number
          id?: number
          remainingtokens?: number
          stage?: number
          stageprice?: number
          tokensperstage?: number
          totaltokenssold?: number | null
          updatedat?: string | null
        }
        Relationships: []
      }
      stageconfig: {
        Row: {
          cycleid: number
          id: number
          remainingtokens: number
          stage: number
          stageprice: number
          tokensperstage: number
        }
        Insert: {
          cycleid: number
          id?: number
          remainingtokens: number
          stage: number
          stageprice: number
          tokensperstage: number
        }
        Update: {
          cycleid?: number
          id?: number
          remainingtokens?: number
          stage?: number
          stageprice?: number
          tokensperstage?: number
        }
        Relationships: [
          {
            foreignKeyName: "stageconfig_cycleid_fkey"
            columns: ["cycleid"]
            isOneToOne: false
            referencedRelation: "opscycleconfig"
            referencedColumns: ["cycleid"]
          },
        ]
      }
      starnftclaim: {
        Row: {
          claimdate: string | null
          claimstatus: string | null
          contractvalue: number | null
          fundpoolvalue: number | null
          id: number
          opebuybackvalue: number | null
          opevalue: number | null
          opsamount: number | null
          presalevalue: number | null
          price: number | null
          rewardvalue: number | null
          status: string | null
          tokenid: number
          userid: number
          walletaddress: string | null
        }
        Insert: {
          claimdate?: string | null
          claimstatus?: string | null
          contractvalue?: number | null
          fundpoolvalue?: number | null
          id?: number
          opebuybackvalue?: number | null
          opevalue?: number | null
          opsamount?: number | null
          presalevalue?: number | null
          price?: number | null
          rewardvalue?: number | null
          status?: string | null
          tokenid: number
          userid: number
          walletaddress?: string | null
        }
        Update: {
          claimdate?: string | null
          claimstatus?: string | null
          contractvalue?: number | null
          fundpoolvalue?: number | null
          id?: number
          opebuybackvalue?: number | null
          opevalue?: number | null
          opsamount?: number | null
          presalevalue?: number | null
          price?: number | null
          rewardvalue?: number | null
          status?: string | null
          tokenid?: number
          userid?: number
          walletaddress?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_walletaddress"
            columns: ["walletaddress"]
            isOneToOne: false
            referencedRelation: "referralstatsbyarea"
            referencedColumns: ["referreraddress"]
          },
          {
            foreignKeyName: "fk_walletaddress"
            columns: ["walletaddress"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["walletaddress"]
          },
          {
            foreignKeyName: "starnftclaim_tokenid_fkey"
            columns: ["tokenid"]
            isOneToOne: false
            referencedRelation: "starnftconfig"
            referencedColumns: ["tokenid"]
          },
          {
            foreignKeyName: "starnftclaim_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      starnftconfig: {
        Row: {
          airdroprate: number
          benefits: Json
          contractvalue: number
          fundpoolvalue: number | null
          generation1reward: number | null
          generation2reward: number | null
          generation3reward: number | null
          id: number
          maxtiers: number
          name: string
          opebuyback: number
          opebuybackvalue: number | null
          opspresale: number
          opspresalevalue: number
          price: number
          rewardvalue: number | null
          tokenid: number
        }
        Insert: {
          airdroprate: number
          benefits: Json
          contractvalue: number
          fundpoolvalue?: number | null
          generation1reward?: number | null
          generation2reward?: number | null
          generation3reward?: number | null
          id?: number
          maxtiers: number
          name: string
          opebuyback: number
          opebuybackvalue?: number | null
          opspresale: number
          opspresalevalue: number
          price: number
          rewardvalue?: number | null
          tokenid: number
        }
        Update: {
          airdroprate?: number
          benefits?: Json
          contractvalue?: number
          fundpoolvalue?: number | null
          generation1reward?: number | null
          generation2reward?: number | null
          generation3reward?: number | null
          id?: number
          maxtiers?: number
          name?: string
          opebuyback?: number
          opebuybackvalue?: number | null
          opspresale?: number
          opspresalevalue?: number
          price?: number
          rewardvalue?: number | null
          tokenid?: number
        }
        Relationships: []
      }
      starnftpresale: {
        Row: {
          contractvalue: number
          cycleid: number
          id: number
          opsamount: number
          opsvalue: number | null
          presaleprice: number
          remindingvalue: number
          stage: number
          tokenid: number
          walletaddress: string
        }
        Insert: {
          contractvalue: number
          cycleid: number
          id?: number
          opsamount: number
          opsvalue?: number | null
          presaleprice: number
          remindingvalue: number
          stage: number
          tokenid: number
          walletaddress: string
        }
        Update: {
          contractvalue?: number
          cycleid?: number
          id?: number
          opsamount?: number
          opsvalue?: number | null
          presaleprice?: number
          remindingvalue?: number
          stage?: number
          tokenid?: number
          walletaddress?: string
        }
        Relationships: [
          {
            foreignKeyName: "starnftpresale_cycleid_fkey"
            columns: ["cycleid"]
            isOneToOne: false
            referencedRelation: "opscycleconfig"
            referencedColumns: ["cycleid"]
          },
        ]
      }
      userrelationships: {
        Row: {
          createdat: string | null
          id: number
          level: number
          referreraddress: string
          useraddress: string
        }
        Insert: {
          createdat?: string | null
          id?: number
          level: number
          referreraddress: string
          useraddress: string
        }
        Update: {
          createdat?: string | null
          id?: number
          level?: number
          referreraddress?: string
          useraddress?: string
        }
        Relationships: [
          {
            foreignKeyName: "userrelationships_referreraddress_fkey"
            columns: ["referreraddress"]
            isOneToOne: false
            referencedRelation: "referralstatsbyarea"
            referencedColumns: ["referreraddress"]
          },
          {
            foreignKeyName: "userrelationships_referreraddress_fkey"
            columns: ["referreraddress"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["walletaddress"]
          },
          {
            foreignKeyName: "userrelationships_useraddress_fkey"
            columns: ["useraddress"]
            isOneToOne: false
            referencedRelation: "referralstatsbyarea"
            referencedColumns: ["referreraddress"]
          },
          {
            foreignKeyName: "userrelationships_useraddress_fkey"
            columns: ["useraddress"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["walletaddress"]
          },
        ]
      }
      users: {
        Row: {
          createdat: string | null
          id: number
          isactive: boolean | null
          placementarea: string | null
          referreraddress: string | null
          walletaddress: string
        }
        Insert: {
          createdat?: string | null
          id?: number
          isactive?: boolean | null
          placementarea?: string | null
          referreraddress?: string | null
          walletaddress: string
        }
        Update: {
          createdat?: string | null
          id?: number
          isactive?: boolean | null
          placementarea?: string | null
          referreraddress?: string | null
          walletaddress?: string
        }
        Relationships: []
      }
    }
    Views: {
      currentstageview: {
        Row: {
          cycleid: number | null
          remainingtokens: number | null
          stage: number | null
          stageprice: number | null
        }
        Relationships: []
      }
      opsprogressview: {
        Row: {
          cycleid: number | null
          remainingtokens: number | null
          stage: number | null
          stageprice: number | null
          stagestatus: string | null
          tokensperstage: number | null
          totaltokenssold: number | null
        }
        Insert: {
          cycleid?: number | null
          remainingtokens?: number | null
          stage?: number | null
          stageprice?: number | null
          stagestatus?: never
          tokensperstage?: number | null
          totaltokenssold?: number | null
        }
        Update: {
          cycleid?: number | null
          remainingtokens?: number | null
          stage?: number | null
          stageprice?: number | null
          stagestatus?: never
          tokensperstage?: number | null
          totaltokenssold?: number | null
        }
        Relationships: []
      }
      referral_tree_view: {
        Row: {
          isactive: boolean | null
          memberstatus: string | null
          parentaddress: string | null
          tier: number | null
          useraddress: string | null
          userid: number | null
        }
        Relationships: []
      }
      referralstatsbyarea: {
        Row: {
          activereferrals: number | null
          inactivereferrals: number | null
          placementarea: string | null
          referreraddress: string | null
          totalreferrals: number | null
        }
        Relationships: []
      }
      referraltree: {
        Row: {
          isactive: boolean | null
          memberstatus: string | null
          parentaddress: string | null
          tier: number | null
          useraddress: string | null
          userid: number | null
        }
        Relationships: []
      }
      referraltreebytier: {
        Row: {
          isactive: boolean | null
          memberstatus: string | null
          parentaddress: string | null
          tier: number | null
          useraddress: string | null
          userid: number | null
        }
        Relationships: []
      }
      referraltreewithactivestatus: {
        Row: {
          createdat: string | null
          isactive: boolean | null
          memberstatus: string | null
          parentaddress: string | null
          placementarea: string | null
          tier: number | null
          useraddress: string | null
          userid: number | null
        }
        Relationships: []
      }
      stagesummaryview: {
        Row: {
          cycleid: number | null
          remainingtokens: number | null
          stage: number | null
          stageprice: number | null
          stagestatus: string | null
          tokensperstage: number | null
          tokenssold: number | null
          totaltokenssold: number | null
        }
        Insert: {
          cycleid?: number | null
          remainingtokens?: number | null
          stage?: number | null
          stageprice?: number | null
          stagestatus?: never
          tokensperstage?: number | null
          tokenssold?: never
          totaltokenssold?: number | null
        }
        Update: {
          cycleid?: number | null
          remainingtokens?: number | null
          stage?: number | null
          stageprice?: number | null
          stagestatus?: never
          tokensperstage?: number | null
          tokenssold?: never
          totaltokenssold?: number | null
        }
        Relationships: []
      }
      stageview: {
        Row: {
          cycleid: number | null
          cyclemaxprice: number | null
          cycleminprice: number | null
          cycletotalamount: number | null
          remainingtokens: number | null
          stage: number | null
          stageprice: number | null
          stagepriceincrease: number | null
          tokensperstage: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stageconfig_cycleid_fkey"
            columns: ["cycleid"]
            isOneToOne: false
            referencedRelation: "opscycleconfig"
            referencedColumns: ["cycleid"]
          },
        ]
      }
    }
    Functions: {
      calculate_referral_rewards: {
        Args: {
          badge_level: number
          presale_amount: number
          user_address: string
        }
        Returns: {
          gen1_reward: number
          gen2_reward: number
          gen3_reward: number
        }[]
      }
      calculate_tier_rewards: {
        Args: {
          badge_level: number
          presale_amount: number
          user_address: string
        }
        Returns: number
      }
      check_and_update_progress: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      notify_cycle_change: {
        Args: {
          cycle: number
        }
        Returns: undefined
      }
      notify_stage_change: {
        Args: {
          cycle: number
          stage: number
          price: number
        }
        Returns: undefined
      }
    }
    Enums: {
      starnft_claim_status: "claiming" | "activated" | "releasing" | "completed"
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
