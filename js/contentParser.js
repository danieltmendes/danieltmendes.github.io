var links = content.links;

function getPersonLink(person)
{
  var link = links[person];
  if(link == null)
    return person;
  else
    return '<a target="_blank" href="' + link + '">' + person + '</a>';
}

var filter = null;

function filterArray(element)
{
  return element[filter.field] == filter.value;
}

function parseStudents(degree)
{
  var output = '';
  filter = {'field': 'degree', 'value': degree};
  for (student of content.students.filter(filterArray))
  {
    output += '<li><span class="student">' + getPersonLink(student.name) + '</span>, ';
    
    if(student.url != null)
      output += '<a target="_blank" href="' + student.url + '">' + student.title + '</a>';
    else
      output += student.title;
    
    output += ', ' + student.year + '.';

    if(student.coadvisor != null)
    {
      output += ' (' + (student.unnoficial? 'unnoficial ' : '') + 'co-adviser to ';

      if(Array.isArray(student.coadvisor))
      {
        for (let i = 0; i < student.coadvisor.length; i++) {
          output += getPersonLink(student.coadvisor[i]);
          if(i < student.coadvisor.length - 1)
            output += ', ';
        }
      }
      else
        output += getPersonLink(student.coadvisor);
      
      output += ')';
    }

    output += '</span></li>';
  }
  return output;
}

function parsePapers()
{
  var years = [];
  for(paper of content.papers)
  {
    years.push(paper.year);
  }
  years = [...new Set(years)];
  years.sort();
  years.reverse();

  var output = '';
  for (let y = 0; y < years.length; y++)
  {
    let year = years[y];
    output += '<h3 class="year y' + year + '"><a onclick="javascript:showPublications(' + "'" + year + "'" + ');">' + year + '</a></h3>';
    
    filter = {'field': 'year', 'value': year};
    for (paper of content.papers.filter(filterArray))
    {
      output += '<div class="publication row ' + paper.year + (y == 0 ? ' recent' : '') + '">';
      if(paper.thumbnail) output += '<div class="image col-md-2"><img src="' + (paper.thumbnail ? paper.thumbnail : 'imgs/soon.jpg') + '" /></div>';
      output += '<div class="col-md-10"><div class="title">' + paper.title +'</div>';
      output += '<div class="authors">' + paper.authors + '</div>';
      output += '<div class="conference">' + paper.venue + (paper.award ? '<img src="imgs/award16.png" /><b>' + paper.award + '</b>' : '') + '</div>';
    
      if(paper.url)
      {
        output += '<div class="links">';
        if(paper.thesis)
        {
          if(Array.isArray(paper.url))
          {
            output += '<a target="_blank" href="papers/' + paper.year + '/' + paper.url[1] + '">Extended Abstract' + '</a>';
            output += '<a target="_blank" href="papers/' + paper.year + '/' + paper.url[0] + '">Thesis' + (paper.portuguese? ' <img src="imgs/pt.gif" />' : '') + '</a>';
          }
          else
            output += '<a target="_blank" href="papers/' + paper.year + '/' + paper.url + '">Thesis' + (paper.portuguese? ' <img src="imgs/pt.gif" />' : '') + '</a>';
        }
        else if(paper.chapter)
        {
          if(Array.isArray(paper.url))
          {
            output += '<a target="_blank" href="' + paper.url[0] + '">Chapter' + (paper.portuguese? ' <img src="imgs/pt.gif" />' : '') + '</a>';
            output += '<a target="_blank" href="papers/' + paper.year + '/' + paper.url[1] + '">Pre-print' + (paper.portuguese? ' <img src="imgs/pt.gif" />' : '') + '</a>';
          }
          else
            output += '<a target="_blank" href="papers/' + paper.year + '/' + paper.url + '">Chapter' + (paper.portuguese? ' <img src="imgs/pt.gif" />' : '') + '</a>';
        }
        else
          output += '<a target="_blank" href="papers/' + paper.year + '/' + paper.url + '">' + (paper.proposal ? 'Proposal' : 'Paper') + (paper.portuguese? ' <img src="imgs/pt.gif" />' : '') + '</a>';
        
        if(paper.video)
          output += '<a target="_blank" href="papers/' + paper.year + '/' + paper.video + '">Video</a>';

        output += '</div>';
      }
      
      output += '</div></div>';
    }
  }
  return output;
}

function parseSubjects()
{
  var output = '';
  var year = 0;
  for(subject of content.subjects)
  {
    if(year != subject.year)
    {
      if(year > 0) output += '</ul></div>';
      output += '<div class="content"><h3>' + subject.year + ' / ' + (parseInt(subject.year) + 1) + '</h3><ul>';
      year = subject.year;
    }
    output += '<li><span class="course">' + subject.name_pt + '</span> (' + subject.name_en + ') - ' + subject.course + '</li>';
  }
  if(year > 0) output += '</ul></div>';
  return output;
}