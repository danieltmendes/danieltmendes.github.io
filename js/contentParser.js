var links = content.links;

function getPersonLink(person)
{
  var link = links[person];
  if(link == null)
    return person;
  else
    return '<a target="_blank" href="' + link + '">' + person + '</a>';
}

function parseStudents()
{
  var output = "";
  for (student of content.students)
  {
    output += '<li><span class="student">' + getPersonLink(student.name) + '</span>, ' + student.title + ', ' + student.year + '.';

    if(student.coadvisor != null)
      output += ' (co-adviser to ' + getPersonLink(student.coadvisor) + ')';

    output += '</span></li>';
  }
  return output;
}