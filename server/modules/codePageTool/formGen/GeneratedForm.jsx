import db from "../config/db.js";


      // Field:
      a
      (FieldID:
      ) // Source SP:
      LT_DCS_SP_SAVE_FORM_GENERATION_DETAILS
      async get_a_details(p_Layout_ID) { try { const query = `CALL
      LT_DCS_SP_SAVE_FORM_GENERATION_DETAILS(?);`; const params = [p_Layout_ID]; const [rows] = await
      db.execute(query, params); return rows; } catch (error) {
      console.error("Repository Error (get_a_details):", error);
      throw error; } } // Saving Field Data Using Storing SP:
      SP_SAVE_DEMO
      async save_a(data) { try { const query = `CALL
      SP_SAVE_DEMO(?);`; const params = [JSON.stringify(data)]; const [result]
      = await db.execute(query, params); return result; } catch (error) {
      console.error("Repository Error (save_a):", error); throw
      error; } }


export default
();