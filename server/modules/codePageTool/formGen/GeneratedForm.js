const saveA = async (
  p_snippet_id, p_field_type_id, p_language_id, p_snippet_type_id, p_snippet_name, p_snippet
) => {
  try {
    const query = `CALL LT_DCS_SP_INSERT_UPDATE_SNIPPET(
      ?, ?, ?, ?, ?, ?
    );`;

    const params = [
      p_snippet_id, p_field_type_id, p_language_id, p_snippet_type_id, p_snippet_name, p_snippet
    ];

    const [rows] = await pool.query(query, params);
    return rows;

  } catch (error) {
    console.error("Repository Error (a):", error);
    throw error;
  }
};

 
 module.exports = {
  saveA,
};

