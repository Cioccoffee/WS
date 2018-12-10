<!DOCTYPE html>
<html>
<head>
<title>Levenshtein distance</title>
</head>

<body>
</body>
  <script>
    function LevenshteinDistance(word1, word2){
      var len1 = word1.length;
      var len2 = word2.length;
      var matrix = [];
      for (var line = 0; line <= len1; line++) {
        matrix[line] = [];
        for (var column = 0; column <= len2; column++) matrix[line][column] = 0;
      }

      for (var i = 1; i <= len1; i++) matrix[i][0] = i;
      for (var j = 1; j <= len2; j++) matrix[0][j] = j;

      for (var j = 1; j <= len2; j++){
        for (var i = 1; i <= len1; i++){
          var cost = word1[i-1] == word2[j-1] ? 0 : 1;
          matrix[i][j] = Math.min(Math.min(matrix[i-1][j] + 1, matrix[i][j-1] + 1), matrix[i-1][j-1] + cost);
        }
      }
      return matrix[len1][len2];
    }
    console.log(LevenshteinDistance("pablo picasso","rablo jiraso kho"));
  </script>
</html>
